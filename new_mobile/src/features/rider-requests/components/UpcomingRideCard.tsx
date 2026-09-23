// src/features/rider-requests/components/UpcomingRideCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { RideStatusBadge } from '@/features/rider-requests/components/RideStatusBadge';
import { needsConfirmation } from '@/features/rider-requests/utils/ride-state';
import type { ScheduledRide } from '@/features/scheduled/types/scheduled.types';
import { useTheme } from '@/hooks/use-theme';

type UpcomingRideCardProps = {
  ride: ScheduledRide;
};

function formatScheduledDate(iso: string | null): string {
  if (!iso) return 'Scheduled';
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const time = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;
  return date.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function UpcomingRideCard({ ride }: UpcomingRideCardProps) {
  const router = useRouter();
  const theme = useTheme();

  const requiresAction = needsConfirmation(ride.status);

  const openDetail = () => {
    router.push(`/passenger/ride/${ride.id}` as never);
  };

  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {requiresAction ? 'Action required' : 'Upcoming ride'}
          </ThemedText>
          <ThemedText type="body">
            {formatScheduledDate(ride.scheduled_for)}
          </ThemedText>
        </View>
        <RideStatusBadge status={ride.status} />
      </View>

      {/* Route */}
      <View style={styles.route}>
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: theme.primary }]} />
          <ThemedText type="body" numberOfLines={1} style={styles.flex}>
            {ride.origin.label}
          </ThemedText>
        </View>
        <View
          style={[styles.connector, { backgroundColor: theme.border }]}
        />
        <View style={styles.routeRow}>
          <Ionicons name="location" size={12} color={theme.danger} />
          <ThemedText type="body" numberOfLines={1} style={styles.flex}>
            {ride.destination.label}
          </ThemedText>
        </View>
      </View>

      {/* Meta */}
      <View style={styles.metaRow}>
        <Badge
          label={ride.ride_access_type === 'SHARED' ? 'Shared' : 'Private'}
        />
        <Badge label={ride.transport_mode} />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {requiresAction ? (
          <View style={styles.actionBtn}>
            <Button label="Confirm" onPress={openDetail} />
          </View>
        ) : null}
        <View style={styles.actionBtn}>
          <Button
            label="View ride"
            variant="secondary"
            onPress={openDetail}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  headerLeft: {
    flex: 1,
    gap: 2,
  },
  route: {
    gap: Spacing.one,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  connector: {
    width: 1.5,
    height: 12,
    marginLeft: 4,
  },
  flex: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  actionBtn: {
    flex: 1,
  },
});