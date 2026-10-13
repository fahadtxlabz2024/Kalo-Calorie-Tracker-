import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { StripeProvider } from '@stripe/stripe-react-native';
import { MealProvider } from '../context/MealContext';
import { AuthProvider } from '../context/AuthContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  const router = useRouter();

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;

      try {
        // 1. Check for token hash fragment (#access_token=...&refresh_token=...)
        if (url.includes('#')) {
          const hash = url.split('#')[1];
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error) {
              if (type === 'recovery' || url.includes('ResetPasswordScreen')) {
                router.replace('/auth/ResetPasswordScreen');
              } else if (url.includes('LoginScreen')) {
                router.replace('/auth/LoginScreen');
              }
            }
            return;
          }
        }

        // 2. Check for PKCE code query param (?code=...)
        if (url.includes('code=')) {
          const parsed = Linking.parse(url);
          const code = parsed.queryParams?.code;
          if (typeof code === 'string') {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error) {
              if (url.includes('ResetPasswordScreen') || url.includes('recovery')) {
                router.replace('/auth/ResetPasswordScreen');
              } else if (url.includes('LoginScreen')) {
                router.replace('/auth/LoginScreen');
              }
            }
          }
        }
      } catch (err) {
        console.warn('Error handling deep link:', err);
      }
    };

    // Initial URL for cold-launch
    Linking.getInitialURL().then(handleUrl);

    // Listener for URL events when app is already open
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <StripeProvider
      publishableKey={stripeKey}
      merchantIdentifier="merchant.com.kalo"
    >
      <AuthProvider>
        <SubscriptionProvider>
          <MealProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'default' }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="welcome" />
              <Stack.Screen name="auth/LoginScreen" />
              <Stack.Screen name="auth/SignUpScreen" />
              <Stack.Screen name="auth/ForgetPasswordScreen" />
              <Stack.Screen name="auth/ResetPasswordScreen" />
              <Stack.Screen name="about" />
              <Stack.Screen name="plan" />
              <Stack.Screen name="today" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="profileDetails" />
              <Stack.Screen name="subscriptions/subscriptions" />
              <Stack.Screen name="subscriptions/reviewSubscriptionDetail" />
            </Stack>
          </MealProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </StripeProvider>
  );
}


