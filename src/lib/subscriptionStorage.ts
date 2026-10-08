import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const FREE_MEALS_KEY = '@kalo_free_meals_count';
const SUBSCRIPTION_INFO_KEY = '@kalo_subscription_info';

export type PlanType = 'none' | 'trial' | 'monthly' | 'yearly';

export interface SubscriptionData {
  email: string | null;
  planType: PlanType;
  hasUsedTrial: boolean;
  subscriptionCreatedAt: string | null;
  trialExpiredNotified?: boolean;
}

/**
 * Get the count of free meals used locally via AsyncStorage.
 */
export const getFreeMealsUsed = async (): Promise<number> => {
  try {
    const val = await AsyncStorage.getItem(FREE_MEALS_KEY);
    return val !== null ? parseInt(val, 10) : 0;
  } catch (error) {
    console.error('Error reading free meals count:', error);
    return 0;
  }
};

/**
 * Increment the free meals counter by 1.
 */
export const incrementFreeMealsUsed = async (): Promise<number> => {
  try {
    const current = await getFreeMealsUsed();
    const updated = current + 1;
    await AsyncStorage.setItem(FREE_MEALS_KEY, updated.toString());
    return updated;
  } catch (error) {
    console.error('Error incrementing free meals count:', error);
    return 0;
  }
};

/**
 * Reset free meals count.
 */
export const resetFreeMealsUsed = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FREE_MEALS_KEY);
  } catch (error) {
    console.error('Error resetting free meals count:', error);
  }
};

/**
 * Get subscription details for current user email or device.
 * Attempts to load from Supabase database first, falling back to local AsyncStorage.
 * Automatically checks for trial/subscription expiration.
 */
export const getSubscriptionData = async (
  userEmail?: string | null
): Promise<SubscriptionData> => {
  let localData: SubscriptionData | null = null;
  const key = userEmail ? `${SUBSCRIPTION_INFO_KEY}_${userEmail}` : SUBSCRIPTION_INFO_KEY;

  try {
    const jsonStr = await AsyncStorage.getItem(key);
    if (jsonStr) {
      localData = JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error('Error reading local subscription data:', error);
  }

  // Fetch from Supabase if user email is present
  if (userEmail) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

      if (data && !error) {
        const remoteData: SubscriptionData = {
          email: data.email,
          planType: data.plan_type as PlanType,
          hasUsedTrial: data.has_used_trial,
          subscriptionCreatedAt: data.subscription_created_at,
          trialExpiredNotified: localData?.trialExpiredNotified ?? false,
        };

        // Sync remote data into local storage
        await AsyncStorage.setItem(key, JSON.stringify(remoteData));
        localData = remoteData;
      }
    } catch (e) {
      console.warn('Supabase fetch subscription fallback:', e);
    }
  }

  const resultData: SubscriptionData = localData ?? {
    email: userEmail ?? null,
    planType: 'none',
    hasUsedTrial: false,
    subscriptionCreatedAt: null,
    trialExpiredNotified: false,
  };

  // Auto-expire trial or paid subscription if duration elapsed
  if (resultData.subscriptionCreatedAt && resultData.planType !== 'none') {
    const createdAtMs = new Date(resultData.subscriptionCreatedAt).getTime();
    const nowMs = Date.now();
    let durationMs = 0;

    if (resultData.planType === 'trial') {
      durationMs = 1 * 60 * 1000; // 1 minutes (TESTING MODE - change back to 7 * 24 * 60 * 60 * 1000 for production)
    } else if (resultData.planType === 'monthly') {
      durationMs = 30 * 24 * 60 * 60 * 1000; // 30 days
    } else if (resultData.planType === 'yearly') {
      durationMs = 365 * 24 * 60 * 60 * 1000; // 365 days
    }

    if (durationMs > 0 && nowMs > createdAtMs + durationMs) {
      resultData.planType = 'none';
      await AsyncStorage.setItem(key, JSON.stringify(resultData));

      // Sync auto-expiration to Supabase database
      if (userEmail) {
        supabase
          .from('subscriptions')
          .update({ plan_type: 'none', updated_at: new Date().toISOString() })
          .eq('email', userEmail)
          .then(({ error }) => {
            if (error) console.warn('Supabase expire update warning:', error.message);
          });
      }
    }
  }

  return resultData;
};

/**
 * Save updated subscription data to both AsyncStorage and Supabase database.
 */
export const saveSubscriptionData = async (
  data: Partial<SubscriptionData>,
  userEmail?: string | null
): Promise<SubscriptionData> => {
  try {
    const current = await getSubscriptionData(userEmail);
    const updated: SubscriptionData = {
      ...current,
      ...data,
      email: userEmail ?? data.email ?? current.email,
    };

    // 1. Save locally in AsyncStorage
    const key = updated.email ? `${SUBSCRIPTION_INFO_KEY}_${updated.email}` : SUBSCRIPTION_INFO_KEY;
    await AsyncStorage.setItem(key, JSON.stringify(updated));

    // 2. Upsert to Supabase database
    if (updated.email) {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id ?? null;

      const { error } = await supabase.from('subscriptions').upsert(
        {
          email: updated.email,
          user_id: userId,
          plan_type: updated.planType,
          has_used_trial: updated.hasUsedTrial,
          subscription_created_at: updated.subscriptionCreatedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

      if (error) {
        console.warn('Supabase subscription sync warning:', error.message);
      }
    }

    return updated;
  } catch (error) {
    console.error('Error saving subscription data:', error);
    throw error;
  }
};

/**
 * Mark trial expired notification as dismissed so the modal is not shown again.
 */
export const markTrialExpiredNotified = async (userEmail?: string | null): Promise<void> => {
  const current = await getSubscriptionData(userEmail);
  const updated = { ...current, trialExpiredNotified: true };
  const key = updated.email ? `${SUBSCRIPTION_INFO_KEY}_${updated.email}` : SUBSCRIPTION_INFO_KEY;
  await AsyncStorage.setItem(key, JSON.stringify(updated));
};

