// src/app/+not-found.tsx

import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.container}>
        <ThemedText type="title1">Not found</ThemedText>
        <ThemedText type="body" themeColor="textSecondary">
          The page you are looking for does not exist.
        </ThemedText>
        <Button label="Go home" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
});