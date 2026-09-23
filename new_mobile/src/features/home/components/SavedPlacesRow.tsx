// src/features/home/components/SavedPlacesRow.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import type { SavedPlace } from '@/features/places/types/place.types';
import { useSavedPlacesStore } from '@/features/places/store/savedPlaces.store';
import { useTheme } from '@/hooks/use-theme';

type SavedPlacesRowProps = {
  onSelectPlace: (place: SavedPlace) => void;
  onAddPlace: () => void;
};

export function SavedPlacesRow({
  onSelectPlace,
  onAddPlace,
}: SavedPlacesRowProps) {
  const theme = useTheme();
  const places = useSavedPlacesStore((s) => s.places);

  const home = places.find((p) => p.type === 'HOME');
  const work = places.find((p) => p.type === 'WORK');
  const customs = places.filter((p) => p.type === 'CUSTOM');

  const hasAny = home || work || customs.length > 0;

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        Saved places
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {home ? (
          <PlaceChip
            icon="home-outline"
            label="Home"
            onPress={() => onSelectPlace(home)}
          />
        ) : null}

        {work ? (
          <PlaceChip
            icon="briefcase-outline"
            label="Work"
            onPress={() => onSelectPlace(work)}
          />
        ) : null}

        {customs.map((place) => (
          <PlaceChip
            key={place.id}
            icon="bookmark-outline"
            label={place.label}
            onPress={() => onSelectPlace(place)}
          />
        ))}

        <PlaceChip
          icon="add"
          label={hasAny ? 'Add' : 'Add a place'}
          onPress={onAddPlace}
          accent
        />
      </ScrollView>
    </View>
  );
}

type PlaceChipProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  accent?: boolean;
};

function PlaceChip({ icon, label, onPress, accent }: PlaceChipProps) {
  const theme = useTheme();

  const borderColor = accent ? theme.primary : theme.border;
  const textColor = accent ? theme.primary : theme.text;
  const iconColor = accent ? theme.primary : theme.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor,
          backgroundColor: theme.backgroundElement,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
      <ThemedText type="small" style={{ color: textColor }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.full,
    borderWidth: 1,
    minHeight: 40,
  },
});