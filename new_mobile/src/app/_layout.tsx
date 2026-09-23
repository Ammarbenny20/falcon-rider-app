// src/app/_layout.tsx

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { isBiometricEnabled } from '@/features/auth/biometric/preferences';
import { useMe } from '@/features/auth/hooks/useMe';
import { useSession } from '@/features/auth/hooks/useSession';
import { useHydrateAuth } from '@/hooks/use-hydrate-auth';
import { queryClient } from '@/lib/query-client';

function SessionSplash() {
  return (
    <View style={styles.splash}>
      <ActivityIndicator size="large" />
    </View>
  );
}

/**
 * Inside the authenticated tree, fetch the user profile.
 * Renders either the main app stack or the biometric-unlock screen
 * depending on whether the user enabled biometric and hasn't unlocked yet.
 */
function AuthenticatedStack() {
  useMe();
  const [needsUnlock, setNeedsUnlock] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    isBiometricEnabled().then((enabled) => {
      if (!cancelled) setNeedsUnlock(enabled);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (needsUnlock === null) {
    return <SessionSplash />;
  }

  if (needsUnlock) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="journey" />
    </Stack>
  );
}

function UnauthenticatedStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  useHydrateAuth();
  const { status } = useSession();

  let content: React.ReactNode;

  if (status === 'unknown' || status === 'restoring') {
    content = <SessionSplash />;
  } else if (status === 'authenticated') {
    content = <AuthenticatedStack />;
  } else {
    content = <UnauthenticatedStack />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {content}
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});