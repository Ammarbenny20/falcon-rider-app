// src/app/(auth)/biometric-setup.tsx

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { useBiometric } from '@/features/auth/biometric/useBiometric';
import { enableBiometricPreference } from '@/features/auth/biometric/preferences';

export default function BiometricSetupScreen() {
  const router = useRouter();
  const { isAvailable, availability, authenticate } = useBiometric();
  const [busy, setBusy] = useState(false);

  const finish = () => router.replace('/(tabs)');

  const enable = async () => {
    setBusy(true);
    try {
      const result = await authenticate('Enable biometric unlock');
      if (result.outcome === 'success') {
        await enableBiometricPreference();
      }
    } finally {
      setBusy(false);
      finish();
    }
  };

  const skip = () => finish();

  return (
    <Screen style={styles.content}>
      <ThemedText type="title1">Secure your account</ThemedText>

      <ThemedText type="body" themeColor="textSecondary">
        {isAvailable
          ? 'Enable Face ID or fingerprint to unlock Falcon Rider faster next time.'
          : availability === 'not_enrolled'
            ? 'Set up Face ID or fingerprint in your device settings to enable faster unlock.'
            : 'Biometric unlock is not available on this device.'}
      </ThemedText>

      {isAvailable ? (
        <Button
          label="Enable biometric"
          size="lg"
          onPress={enable}
          loading={busy}
        />
      ) : null}

      <Button
        label={isAvailable ? 'Not now' : 'Continue'}
        size="lg"
        variant="secondary"
        onPress={skip}
        disabled={busy}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    gap: Spacing.five,
  },
});