// src/app/(auth)/welcome.tsx

import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Spacing } from '@/constants/spacing';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.content}>
      <View style={styles.hero}>
        <Logo size="2xl" variant="circle" />
        <ThemedText type="display" style={styles.brand}>
          Falcon Rider
        </ThemedText>
        <ThemedText
          type="title3"
          themeColor="textSecondary"
          style={styles.tagline}
        >
          Make Every Commute Better
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Button
          label="Log in"
          size="lg"
          onPress={() => router.push('/login')}
        />
        <Button
          label="Create account"
          size="lg"
          variant="secondary"
          onPress={() => router.push('/signup')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.eight,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.five,
  },
  brand: {
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    textAlign: 'center',
    maxWidth: 280,
  },
  actions: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
});