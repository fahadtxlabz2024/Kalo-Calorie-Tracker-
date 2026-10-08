import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';
import { MealProvider } from '../context/MealContext';
import { AuthProvider } from '../context/AuthContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';

export default function RootLayout() {
  const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

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
              <Stack.Screen name="subscriptions/subscriptions" />
              <Stack.Screen name="subscriptions/reviewSubscriptionDetail" />
            </Stack>
          </MealProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </StripeProvider>
  );
}


