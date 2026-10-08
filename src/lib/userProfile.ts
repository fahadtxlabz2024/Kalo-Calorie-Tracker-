import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export interface UserProfileData {
  goal: 'Lose' | 'Keep' | 'Gain';
  sex: 'Female' | 'Male';
  age: string;
  height: string;
  weight: string;
  activity: 'Low' | 'Medium' | 'High';
  calorieGoal: number;
  carbsGoal: number;
  proteinGoal: number;
  fatGoal: number;
  updatedAt?: string;
}

const USER_PROFILE_KEY = '@kalo_user_profile';

/**
 * Default fallback profile if user has not completed onboarding yet
 */
export const DEFAULT_USER_PROFILE: UserProfileData = {
  goal: 'Lose',
  sex: 'Female',
  age: '29',
  height: '172',
  weight: '78',
  activity: 'Medium',
  calorieGoal: 2000,
  carbsGoal: 225,
  proteinGoal: 125,
  fatGoal: 67,
};

/**
 * Generate a random daily calorie goal between 2500 kcal and 3000 kcal
 * and compute proportional macro breakdown.
 */
export const generateRandomCalorieGoal = (): {
  calorieGoal: number;
  carbsGoal: number;
  proteinGoal: number;
  fatGoal: number;
} => {
  // Random number between 2500 and 3000, rounded to nearest 50
  const min = 2500;
  const max = 3000;
  const rawKcal = Math.floor(Math.random() * (max - min + 1)) + min;
  const calorieGoal = Math.round(rawKcal / 50) * 50;

  // Macros: Carbs 45%, Protein 25%, Fat 30%
  const carbsGoal = Math.round((calorieGoal * 0.45) / 4);
  const proteinGoal = Math.round((calorieGoal * 0.25) / 4);
  const fatGoal = Math.round((calorieGoal * 0.30) / 9);

  return { calorieGoal, carbsGoal, proteinGoal, fatGoal };
};

/**
 * Load user profile from AsyncStorage and sync with Supabase user metadata if available.
 */
export const getUserProfile = async (userEmail?: string | null): Promise<UserProfileData> => {
  const key = userEmail ? `${USER_PROFILE_KEY}_${userEmail}` : USER_PROFILE_KEY;

  try {
    const jsonStr = await AsyncStorage.getItem(key);
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
  } catch (err) {
    console.error('Error reading user profile from AsyncStorage:', err);
  }

  // Fallback to Supabase user metadata
  if (userEmail) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const meta = userData?.user?.user_metadata;
      if (meta && meta.user_profile) {
        const profile = meta.user_profile as UserProfileData;
        await AsyncStorage.setItem(key, JSON.stringify(profile));
        return profile;
      }
    } catch (e) {
      console.warn('Supabase fetch profile warning:', e);
    }
  }

  return DEFAULT_USER_PROFILE;
};

/**
 * Save user profile to both AsyncStorage and Supabase user metadata.
 */
export const saveUserProfile = async (
  profile: Partial<UserProfileData>,
  userEmail?: string | null
): Promise<UserProfileData> => {
  const current = await getUserProfile(userEmail);
  const updated: UserProfileData = {
    ...current,
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  const key = userEmail ? `${USER_PROFILE_KEY}_${userEmail}` : USER_PROFILE_KEY;

  try {
    await AsyncStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving user profile to AsyncStorage:', err);
  }

  // Sync to Supabase user metadata
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase.auth.updateUser({
        data: {
          user_profile: updated,
        },
      });
    }
  } catch (e) {
    console.warn('Supabase update user profile metadata warning:', e);
  }

  return updated;
};
