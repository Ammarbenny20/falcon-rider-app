// src/components/map/MapPreview.tsx

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type MapPreviewProps = {
  latitude: number;
  longitude: number;
  label?: string;
};

/**
 * Map preview placeholder.
 *
 * react-native-maps is not supported on web. This component renders a
 * styled placeholder showing the selected location.
 *
 * Real map rendering will be added in Phase 3 using platform-specific
 * files (MapPreview.native.tsx and MapPreview.web.tsx).
 */
export function MapPreview({ latitude, longitude, label }: MapPreviewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.backgroundSelected,
          borderColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: theme.background },
        ]}
      >
        <Ionicons name="location" size={32} color={theme.primary} />
      </View>

      <ThemedText type="body" style={styles.label} numberOfLines={2}>
        {label ?? 'Selected location'}
      </ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    maxWidth: 240,
  },
});