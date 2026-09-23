// src/app/journey/_layout.tsx

import { Stack } from 'expo-router';

export default function JourneyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="templates" />
      <Stack.Screen name="requests/[id]" />
    </Stack>
  );
}