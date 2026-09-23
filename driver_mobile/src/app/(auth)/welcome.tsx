// src/app/(auth)/welcome.tsx

import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Spacing } from '@/constants/spacing';
import { useTranslation } from '@/i18n';

export default function WelcomeScreen() {
  const router = useRouter();
  const t = useTranslation();

  return (
    <Screen style={styles.content}>
      <View style={styles.hero}>
        <Logo size="2xl" variant="circle" />
        <ThemedText type="display" style={styles.center}>
          {t('auth.welcome.title')}
        </ThemedText>
        <ThemedText
          type="title3"
          themeColor="textSecondary"
          style={styles.center}
        >
          {t('auth.welcome.tagline')}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Button
          label={t('auth.welcome.login')}
          size="lg"
          onPress={() => router.push('/(auth)/login')}
        />
        <Button
          label={t('auth.welcome.signup')}
          size="lg"
          variant="secondary"
          onPress={() => router.push('/(auth)/signup')}
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
    gap: Spacing.four,
  },
  center: { textAlign: 'center' },
  actions: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
});