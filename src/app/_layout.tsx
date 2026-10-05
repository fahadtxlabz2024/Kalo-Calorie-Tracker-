import { Stack } from 'expo-router';
import { MealProvider } from '../context/MealContext';

export default function RootLayout() {
  return (
    <MealProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'default' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="about" />
        <Stack.Screen name="plan" />
        <Stack.Screen name="settings" />
      </Stack>
    </MealProvider>
  );
}
