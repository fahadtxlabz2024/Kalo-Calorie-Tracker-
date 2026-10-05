import { Stack } from 'expo-router';
import { MealProvider } from '../context/MealContext';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
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
          <Stack.Screen name="subscriptions/subscriptions" options={{ presentation: 'modal' }} />
        </Stack>
      </MealProvider>
    </AuthProvider>
  );
}

