// src/app/passenger/_layout.tsx

import { Stack } from 'expo-router';

export default function PassengerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" />
      <Stack.Screen name="map-select" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="options" />
      <Stack.Screen name="review" />
      <Stack.Screen name="matching" />
      <Stack.Screen name="ride/[id]" />
      <Stack.Screen name="reschedule/[id]" />
    </Stack>
  );
}