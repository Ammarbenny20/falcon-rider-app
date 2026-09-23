import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useTheme } from '@/hooks/use-theme';

export function NetworkBanner() {
  const { isConnected } = useNetworkStatus();
  const theme = useTheme();
  if (isConnected) return null;

  return (
    <ThemedView style={[styles.banner, { backgroundColor: theme.danger }]}>
      <ThemedText type="small" style={{ color: '#FFFFFF' }}>No internet connection</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: { paddingVertical: Spacing.one, alignItems: 'center' },
});
