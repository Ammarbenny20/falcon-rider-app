// src/features/home/components/RecentDestinations.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type RecentDestination = {
  id: string;
  label: string;
  address: string;
};

type RecentDestinationsProps = {
  destinations: RecentDestination[];
  onSelect: (destination: RecentDestination) => void;
};

export function RecentDestinations({
  destinations,
  onSelect,
}: RecentDestinationsProps) {
  const theme = useTheme();

  if (destinations.length === 0) {
    // Phase 2: no backend data yet. Render nothing.
    // Phase 3: will render real recent destinations.
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        Recent
      </ThemedText>

      <Card style={styles.card}>
        {destinations.map((destination, index) => (
          <View key={destination.id}>
            <Pressable
              onPress={() => onSelect(destination)}
              accessibilityRole="button"
              accessibilityLabel={destination.label}
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
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={theme.primary}
                />
              </View>

              <View style={styles.textColumn}>
                <ThemedText type="body" numberOfLines={1}>
                  {destination.label}
                </ThemedText>
                <ThemedText
                  type="small"
                  themeColor="textSecondary"
                  numberOfLines={1}
                >
                  {destination.address}
                </ThemedText>
              </View>
            </Pressable>

            {index < destinations.length - 1 ? (
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
            ) : null}
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  card: {
    padding: 0,
    gap: 0,
  },
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
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.four + 36 + Spacing.three,
  },
});