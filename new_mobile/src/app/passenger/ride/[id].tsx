// src/app/passenger/ride/[id].tsx

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingState } from '@/components/feedback/LoadingState';
import { ThemedText } from '@/components/theme/ThemedText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { RideStatusBadge } from '@/features/rider-requests/components/RideStatusBadge';
import { useCancelRiderRequest } from '@/features/rider-requests/hooks/useCancelRiderRequest';
import { useRiderRequest } from '@/features/rider-requests/hooks/useRiderRequest';
import {
  canCancel,
  canReschedule,
  needsConfirmation,
} from '@/features/rider-requests/utils/ride-state';
import { useConfirmRide } from '@/features/scheduled/hooks/useConfirmRide';
import { useTheme } from '@/hooks/use-theme';

export default function RideDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: ride, isLoading, isError } = useRiderRequest(id);
  const confirm = useConfirmRide();
  const cancel = useCancelRiderRequest();

  if (isLoading) return <LoadingState message="Loading ride…" />;

  if (isError || !ride) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centered}>
          <ThemedText type="title3">Ride not found</ThemedText>
          <Button
            label="Back to home"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const showConfirm = needsConfirmation(ride.status);
  const showCancel = canCancel(ride.status);
  const showReschedule = canReschedule(ride.status);

  const scheduledDate = ride.scheduled_for
    ? new Date(ride.scheduled_for)
    : null;

  const handleConfirm = async () => {
    try {
      await confirm.mutateAsync(ride.id);
      Alert.alert('Ride confirmed', 'Your ride has been confirmed.');
    } catch {
      Alert.alert('Could not confirm', 'Please try again.');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel ride',
      'Are you sure you want to cancel this scheduled ride?',
      [
        { text: 'Keep ride', style: 'cancel' },
        {
          text: 'Cancel ride',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancel.mutateAsync({ id: ride.id });
              router.replace('/(tabs)');
            } catch {
              Alert.alert('Could not cancel', 'Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleReschedule = () => {
    router.push({
      pathname: '/passenger/reschedule/[id]',
      params: { id: ride.id },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">Ride details</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Status */}
        <View style={styles.statusRow}>
          <RideStatusBadge status={ride.status} />
          {scheduledDate ? (
            <Badge
              label={`${scheduledDate.toLocaleDateString()} · ${scheduledDate.toLocaleTimeString(
                [],
                { hour: '2-digit', minute: '2-digit' },
              )}`}
            />
          ) : null}
        </View>

        {/* Route */}
        <Card style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={styles.rowText}>
              <ThemedText type="small" themeColor="textSecondary">
                Pickup
              </ThemedText>
              <ThemedText type="body">{ride.origin.label}</ThemedText>
            </View>
          </View>
          <View
            style={[styles.connector, { backgroundColor: theme.border }]}
          />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={14} color={theme.danger} />
            <View style={styles.rowText}>
              <ThemedText type="small" themeColor="textSecondary">
                Destination
              </ThemedText>
              <ThemedText type="body">{ride.destination.label}</ThemedText>
            </View>
          </View>
        </Card>

        {/* Details */}
        <Card style={styles.detailsCard}>
          <Row
            label="Ride type"
            value={ride.ride_access_type === 'SHARED' ? 'Shared' : 'Private'}
          />
          <Divider />
          <Row label="Vehicle" value={ride.transport_mode} />
          <Divider />
          <Row label="Passengers" value={String(ride.seats_needed)} />
          <Divider />
          <Row
            label="When"
            value={
              ride.is_scheduled && scheduledDate
                ? scheduledDate.toLocaleString()
                : 'Now'
            }
          />
        </Card>

        {/* Actions */}
        {showConfirm ? (
          <Button
            label="Confirm ride"
            size="lg"
            onPress={handleConfirm}
            loading={confirm.isPending}
          />
        ) : null}

        {showReschedule ? (
          <Button
            label="Change time"
            variant="secondary"
            size="lg"
            onPress={handleReschedule}
          />
        ) : null}

        {showCancel ? (
          <Button
            label="Cancel ride"
            variant="ghost"
            onPress={handleCancel}
            loading={cancel.isPending}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.rowBetween}>
      <ThemedText type="body" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="body">{value}</ThemedText>
    </View>
  );
}

function Divider() {
  const theme = useTheme();
  return <View style={[styles.divider, { backgroundColor: theme.border }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  routeCard: { gap: Spacing.three },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  rowText: { flex: 1, gap: 2 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  connector: {
    width: 1.5,
    height: 20,
    marginLeft: 5,
  },
  detailsCard: { gap: Spacing.three },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});