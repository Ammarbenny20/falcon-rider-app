// src/components/feedback/ErrorState.tsx

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { ThemedView } from '@/components/theme/ThemedView';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type ErrorStateProps = {
  error?: unknown;
  onRetry?: () => void;
};

function getErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong.';
  if (error instanceof Error) return error.message;
  return String(error);
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: 'rgba(217, 75, 75, 0.15)' },
        ]}
      >
        <Ionicons name="alert-circle" size={40} color={theme.danger} />
      </View>

      <ThemedText type="title3" style={styles.center}>
        Something went wrong
      </ThemedText>

      <ThemedText
        type="body"
        themeColor="textSecondary"
        style={styles.center}
      >
        {getErrorMessage(error)}
      </ThemedText>

      {onRetry ? (
        <View style={styles.actionWrap}>
          <Button label="Try again" onPress={onRetry} />
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.five,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
    maxWidth: 320,
  },
  actionWrap: {
    marginTop: Spacing.two,
    minWidth: 200,
  },
});