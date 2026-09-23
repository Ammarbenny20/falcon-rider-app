// src/app/+not-found.tsx

import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.content}>
      <ThemedText type="title">Not found</ThemedText>
      <ThemedText type="default" themeColor="textSecondary">
        The page you are looking for does not exist.
      </ThemedText>
      <Button label="Go home" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    gap: Spacing.three,
  },
});