import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { toUserMessage } from '@/utils/error-messages';

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.center}>Something went wrong</ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.center}>{toUserMessage(error)}</ThemedText>
      {onRetry ? <Button label="Try again" onPress={onRetry} /> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
  center: { textAlign: 'center' },
});
