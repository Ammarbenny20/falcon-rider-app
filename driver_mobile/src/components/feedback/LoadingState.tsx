// src/components/feedback/LoadingState.tsx

import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { ThemedView } from '@/components/theme/ThemedView';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator color={theme.primary} />
      <ThemedText type="small" themeColor="textSecondary">
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});