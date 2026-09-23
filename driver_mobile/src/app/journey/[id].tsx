// src/app/journey/[id].tsx

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
import { useJourneys } from '@/features/journey/hooks/useJourneys';
import { formatCurrency, formatRelativeDateTime } from '@/utils/formatters';
import { useTheme } from '@/hooks/use-theme';

export default function JourneyDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: journeys, isLoading } = useJourneys();

  const journey = journeys?.find((j) => j.id === id);

  if (isLoading) return <LoadingState />;

  if (!journey) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.centered}>
          <ThemedText type="title3">Journey not found</ThemedText>
          <Button label="Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">Journey details</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.statusRow}>
          <Badge label={journey.status} tone="success" />
          <Badge label={journey.transport_mode} />
        </View>

        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={styles.textCol}>
              <ThemedText type="small" themeColor="textSecondary">
                Origin
              </ThemedText>
              <ThemedText type="body">{journey.origin.label}</ThemedText>
            </View>
          </View>
          <View
            style={[styles.connector, { backgroundColor: theme.border }]}
          />
          <View style={styles.row}>
            <Ionicons name="location" size={14} color={theme.danger} />
            <View style={styles.textCol}>
              <ThemedText type="small" themeColor="textSecondary">
                Destination
              </ThemedText>
              <ThemedText type="body">
                {journey.destination.label}
              </ThemedText>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Row
            label="Departure"
            value={formatRelativeDateTime(journey.departure_time)}
          />
          <Divider />
          <Row
            label="Seats"
            value={`${journey.available_seats}/${journey.total_seats}`}
          />
          <Divider />
          <Row
            label="Price per seat"
            value={formatCurrency(journey.price_per_seat, journey.currency)}
          />
          <Divider />
          <Row
            label="Requests"
            value={String(journey.requests_count)}
          />
        </Card>

        {journey.status === 'PUBLISHED' || journey.status === 'ACTIVE' ? (
          <Button
            label="Cancel journey"
            variant="danger"
            onPress={() =>
              Alert.alert('Cancel', 'Feature coming soon.')
            }
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  body: { padding: Spacing.four, gap: Spacing.four },
  statusRow: { flexDirection: 'row', gap: Spacing.two },
  card: { gap: Spacing.three },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  textCol: { flex: 1, gap: 2 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  connector: { width: 1.5, height: 20, marginLeft: 5 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: { height: StyleSheet.hairlineWidth },
});