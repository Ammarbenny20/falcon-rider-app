// src/app/(auth)/biometric-unlock.tsx

import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { useBiometric } from '@/features/auth/biometric/useBiometric';
import { useSession } from '@/features/auth/hooks/useSession';
import { useUserStore } from '@/features/auth/store/user.store';

export default function BiometricUnlockScreen() {
  const router = useRouter();
  const { isAvailable, authenticate } = useBiometric();
  const { user } = useSession();
  const setUser = useUserStore((s) => s.setUser);
  const [busy, setBusy] = useState(false);

  const finish = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  const attempt = useCallback(async () => {
    if (!isAvailable) return;
    setBusy(true);
    try {
      const result = await authenticate('Unlock Falcon Rider');
      if (result.outcome === 'success') {
        finish();
      }
      // On cancel or failure: do nothing. The user can retry or use password.
    } finally {
      setBusy(false);
    }
  }, [authenticate, finish, isAvailable]);

  useEffect(() => {
    // Trigger biometric check once on mount.
    void attempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usePassword = () => {
    // Clear in-memory user so the login screen doesn't briefly show stale data.
    setUser(null);
    router.replace('/login');
  };

  const displayName = user?.full_name?.split(' ')[0] ?? '';

  return (
    <Screen style={styles.content}>
      <ThemedText type="title1" style={styles.center}>
        {displayName ? `Welcome back, ${displayName}` : 'Welcome back'}
      </ThemedText>

      <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
        {isAvailable
          ? 'Unlock with Face ID or fingerprint to continue.'
          : 'Biometric is not available on this device.'}
      </ThemedText>

      {isAvailable ? (
        <Button
          label="Unlock"
          size="lg"
          onPress={attempt}
          loading={busy}
        />
      ) : null}

      <Button
        label="Use password instead"
        size="lg"
        variant="secondary"
        onPress={usePassword}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    gap: Spacing.five,
  },
  center: {
    textAlign: 'center',
  },
});