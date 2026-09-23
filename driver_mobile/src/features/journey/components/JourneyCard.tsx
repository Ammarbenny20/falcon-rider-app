// src/features/journey/components/JourneyCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import type { Journey } from '@/features/journey/types/journey.types';
import { formatCurrency, formatRelativeDateTime } from '@/utils/formatters';
import { useTheme } from '@/hooks/use-theme';

type JourneyCardProps = {
  journey: Journey;
};

export function JourneyCard({ journey }: JourneyCardProps) {
  const router = useRouter();
  const theme = useTheme();

  const tone =
    journey.status === 'PUBLISHED' || journey.status === 'ACTIVE'
      ? 'success'
      : journey.status === 'CANCELLED' || journey.status === 'EXPIRED'
        ? 'danger'
        : 'neutral';

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/journey/[id]',
          params: { id: journey.id },
        })
      }
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <ThemedText type="small" themeColor="textSecondary">
            {formatRelativeDateTime(journey.departure_time)}
          </ThemedText>
          <Badge label={journey.status} tone={tone} />
        </View>

        <View style={styles.route}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <ThemedText type="body" numberOfLines={1} style={styles.flex}>
              {journey.origin.label}
            </ThemedText>
          </View>
          <View
            style={[styles.connector, { backgroundColor: theme.border }]}
          />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={12} color={theme.danger} />
            <ThemedText type="body" numberOfLines={1} style={styles.flex}>
              {journey.destination.label}
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText type="small" themeColor="textSecondary">
            {journey.available_seats}/{journey.total_seats} seats ·{' '}
            {formatCurrency(journey.price_per_seat, journey.currency)}
          </ThemedText>
          {journey.requests_count > 0 ? (
            <Badge label={`${journey.requests_count} requests`} />
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
  dot: { width: 10, height: 10, borderRadius: 5 },
  connector: { width: 1.5, height: 12, marginLeft: 4 },
  flex: { flex: 1 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});