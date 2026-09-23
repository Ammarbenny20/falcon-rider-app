// src/app/_layout.tsx

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { useMe } from '@/features/auth/hooks/useMe';
import { useSession } from '@/features/auth/hooks/useSession';
import { useHydrateAuth } from '@/hooks/use-hydrate-auth';
import { usePreferences } from '@/hooks/use-preferences';
import { queryClient } from '@/lib/query-client';

function AuthGate({ children }: { children: React.ReactNode }) {
  useHydrateAuth();
  // Fetch user when authenticated
  useMe();

  return <>{children}</>;
}

export default function RootLayout() {
  usePreferences();
  const { isAuthenticated } = useSession();

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="journey" />
              <Stack.Screen name="trip" />
              <Stack.Screen name="settings" />
            </>
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
      </AuthGate>
    </QueryClientProvider>
  );
}