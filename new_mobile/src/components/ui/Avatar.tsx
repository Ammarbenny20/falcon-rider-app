import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type AvatarProps = { uri?: string; name: string; size?: number };

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const theme = useTheme();
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  if (uri) {
    return <Image source={{ uri }} style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]} contentFit="cover" />;
  }

  return (
    <View style={[styles.circle, styles.fallback, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.backgroundSelected }]}>
      <ThemedText type="smallBold" style={{ color: theme.primaryDark }}>
        {initial}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { overflow: 'hidden' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
