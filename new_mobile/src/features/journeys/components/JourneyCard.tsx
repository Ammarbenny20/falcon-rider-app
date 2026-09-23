// src/features/journeys/components/JourneyCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import type { Journey } from '@/features/journeys/types/journey.types';
import { useTheme } from '@/hooks/use-theme';

type JourneyCardProps = {
  journey: Journey;
  onPress?: () => void;
};

export function JourneyCard({ journey, onPress }: JourneyCardProps) {
  const theme = useTheme();

  const dateLabel = journey.scheduled_for
    ? new Date(journey.scheduled_for).toLocaleString()
    : new Date(journey.created_at).toLocaleString();

  const isCompleted = journey.status === 'COMPLETED';
  const isCancelled = journey.status === 'CANCELLED';

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <ThemedText type="small" themeColor="textSecondary">
            {dateLabel}
          </ThemedText>
          <Badge
            label={journey.status}
            tone={
              isCompleted ? 'success' : isCancelled ? 'danger' : 'neutral'
            }
          />
        </View>

        <View style={styles.route}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <ThemedText type="body" numberOfLines={1} style={styles.flex}>
              {journey.origin_label}
            </ThemedText>
          </View>

          <View
            style={[styles.routeLine, { backgroundColor: theme.border }]}
          />

          <View style={styles.routeRow}>
            <Ionicons name="location" size={12} color={theme.danger} />
            <ThemedText type="body" numberOfLines={1} style={styles.flex}>
              {journey.destination_label}
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText type="small" themeColor="textSecondary">
            {journey.booking_type === 'SHARED' ? 'Shared' : 'Private'}
          </ThemedText>
          {journey.fare_amount !== null ? (
            <ThemedText type="smallBold">
              {journey.currency} {journey.fare_amount.toLocaleString()}
            </ThemedText>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  route: { gap: Spacing.one },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  routeLine: {
    height: 12,
    width: 1.5,
    marginLeft: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  flex: { flex: 1 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
});