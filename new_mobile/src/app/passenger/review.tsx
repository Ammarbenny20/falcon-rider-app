// src/app/passenger/review.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { useCreateRiderRequest } from '@/features/rider-requests/hooks/useCreateRiderRequest';
import { useRideDraftStore } from '@/store/ride-draft.store';
import { useTheme } from '@/hooks/use-theme';

export default function ReviewScreen() {
  const router = useRouter();
  const theme = useTheme();

  const pickup = useRideDraftStore((s) => s.pickup);
  const destination = useRideDraftStore((s) => s.destination);
  const seatsNeeded = useRideDraftStore((s) => s.seatsNeeded);
  const rideAccessType = useRideDraftStore((s) => s.rideAccessType);
  const transportMode = useRideDraftStore((s) => s.transportMode);
  const bookingType = useRideDraftStore((s) => s.bookingType);
  const scheduledFor = useRideDraftStore((s) => s.scheduledFor);

  const createRequest = useCreateRiderRequest();

  const canSubmit = Boolean(pickup && destination && transportMode);

  const handleSubmit = async () => {
    if (!pickup || !destination || !transportMode) {
      Alert.alert('Missing info', 'Please complete the ride details.');
      return;
    }

    try {
      const isScheduled = bookingType === 'SCHEDULED';

      const result = await createRequest.mutateAsync({
        origin: {
          latitude: pickup.latitude,
          longitude: pickup.longitude,
          label: pickup.label,
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude,
          label: destination.label,
        },
        requested_time:
          isScheduled && scheduledFor
            ? scheduledFor
            : new Date().toISOString(),
        scheduled_for: isScheduled ? scheduledFor : null,
        is_scheduled: isScheduled,
        seats_needed: seatsNeeded,
        booking_type: bookingType,
        ride_access_type: rideAccessType,
        transport_mode: transportMode,
      });

      router.replace({
        pathname: '/passenger/matching',
        params: { requestId: result.id },
      });
    } catch (e) {
      Alert.alert(
        'Could not create request',
        e instanceof Error ? e.message : 'Please try again.',
      );
    }
  };

  if (!canSubmit) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centered}>
          <ThemedText type="body" themeColor="textSecondary">
            Missing trip information. Please start again.
          </ThemedText>
          <Button
            label="Back to home"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const whenLabel =
    bookingType === 'SCHEDULED' && scheduledFor
      ? new Date(scheduledFor).toLocaleString()
      : 'Now';

  const rideAccessLabel = rideAccessType === 'SHARED' ? 'Shared' : 'Private';
  const transportLabel = transportMode;
  const rideLabel = `${rideAccessLabel} · ${transportLabel}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={26}
          color={theme.text}
          onPress={() => router.back()}
        />
        <ThemedText type="body">Review your ride</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Card style={styles.summaryCard}>
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={styles.rowText}>
              <ThemedText type="small" themeColor="textSecondary">
                Pickup
              </ThemedText>
              <ThemedText type="body" numberOfLines={2}>
                {pickup!.label}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.connector, { backgroundColor: theme.border }]} />

          <View style={styles.row}>
            <Ionicons name="location" size={14} color={theme.danger} />
            <View style={styles.rowText}>
              <ThemedText type="small" themeColor="textSecondary">
                Destination
              </ThemedText>
              <ThemedText type="body" numberOfLines={2}>
                {destination!.label}
              </ThemedText>
            </View>
          </View>
        </Card>

        <Card style={styles.summaryCard}>
          <Row label="When" value={whenLabel} />
          <Divider />
          <Row label="Ride" value={rideLabel} />
          <Divider />
          <Row label="Passengers" value={String(seatsNeeded)} />
          {rideAccessType === 'SHARED' ? (
            <>
              <Divider />
              <Row label="Available seats" value="3 (mock)" />
            </>
          ) : null}
          <Divider />
          <Row label="Estimated fare" value="TZS 5,000 (mock)" />
          <Divider />
          <Row label="Driver arrival" value="~4 min (mock)" />
          <Divider />
          <Row label="Trip duration" value="~18 min (mock)" />
        </Card>

        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={{ textAlign: 'center' }}
        >
          Fare and timing are placeholders until the backend provides them.
        </ThemedText>

        <Button
          label={bookingType === 'SCHEDULED' ? 'Book ride' : 'Request ride'}
          size="lg"
          onPress={handleSubmit}
          loading={createRequest.isPending}
        />
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
  return (
    <View style={[styles.divider, { backgroundColor: theme.border }]} />
  );
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
  summaryCard: { gap: Spacing.three },
  row: {
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});