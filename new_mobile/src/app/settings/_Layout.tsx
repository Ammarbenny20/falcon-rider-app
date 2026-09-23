// src/app/settings/_layout.tsx

import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="language" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="security" />
      <Stack.Screen name="saved-places" />
      <Stack.Screen name="support" />
      <Stack.Screen name="about" />
    </Stack>
  );
}