// src/features/routes/components/SearchResultItem.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Spacing } from '@/constants/spacing';
import type { PlaceSearchResult } from '@/features/routes/types/routes.types';
import { useTheme } from '@/hooks/use-theme';

type SearchResultItemProps = {
  place: PlaceSearchResult;
  onPress: (place: PlaceSearchResult) => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function SearchResultItem({
  place,
  onPress,
  icon = 'location-outline',
}: SearchResultItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onPress(place)}
      accessibilityRole="button"
      accessibilityLabel={`${place.name}, ${place.address}`}
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: theme.backgroundSelected },
        ]}
      >
        <Ionicons name={icon} size={18} color={theme.primary} />
      </View>
      <View style={styles.textColumn}>
        <ThemedText type="body" numberOfLines={1}>
          {place.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {place.address}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
});