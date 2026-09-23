// src/components/layout/Screen.tsx

import { StyleSheet, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NetworkBanner } from '@/components/feedback/NetworkBanner';
import { ThemedView } from '@/components/theme/ThemedView';
import { Spacing } from '@/constants/spacing';

export function Screen({ style, children, ...rest }: ViewProps) {
  return (
    <ThemedView style={styles.flex}>
      <NetworkBanner />
      <SafeAreaView style={[styles.safeArea, style]} {...rest}>
        {children}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four },
});