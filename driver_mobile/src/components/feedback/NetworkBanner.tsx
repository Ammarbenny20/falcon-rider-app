// src/components/feedback/NetworkBanner.tsx

import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

export function NetworkBanner() {
  const theme = useTheme();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );
      setIsOffline(!connected);
    });

    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.danger }]}>
      <ThemedText type="small" style={{ color: '#FFFFFF', fontWeight: '600' }}>
        No internet connection
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
});