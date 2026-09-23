// src/app/passenger/reschedule/[id].tsx

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingState } from '@/components/feedback/LoadingState';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { useRiderRequest } from '@/features/rider-requests/hooks/useRiderRequest';
import { useRescheduleRide } from '@/features/scheduled/hooks/useRescheduleRide';
import { useTheme } from '@/hooks/use-theme';

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RescheduleScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: ride, isLoading, isError } = useRiderRequest(id);
  const reschedule = useRescheduleRide();

  const initial = ride?.scheduled_for
    ? new Date(ride.scheduled_for)
    : new Date(Date.now() + 30 * 60 * 1000);

  const [selected, setSelected] = useState<Date>(initial);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  if (isLoading) return <LoadingState message="Loading ride…" />;
  if (isError || !ride) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centered}>
          <ThemedText type="title3">Ride not found</ThemedText>
          <Button label="Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const isFuture = selected.getTime() > Date.now();
  const canSave = isFuture;

  const handleSave = async () => {
    if (!canSave) {
      Alert.alert('Invalid time', 'Please choose a future time.');
      return;
    }
    try {
      await reschedule.mutateAsync({
        id: ride.id,
        scheduledFor: selected.toISOString(),
      });
      Alert.alert('Ride rescheduled', 'Your ride has been updated.', [
        {
          text: 'OK',
          onPress: () =>
            router.replace({
              pathname: '/passenger/ride/[id]',
              params: { id: ride.id },
            }),
        },
      ]);
    } catch {
      Alert.alert('Could not reschedule', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">Change time</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <ThemedText type="body" themeColor="textSecondary">
          Choose a new date and time for your ride.
        </ThemedText>

        {/* Date */}
        <Pressable onPress={() => setShowDate(true)}>
          <Card style={styles.pickerRow}>
            <Ionicons
              name="calendar-outline"
              size={22}
              color={theme.textSecondary}
            />
            <View style={styles.pickerText}>
              <ThemedText type="small" themeColor="textSecondary">
                Date
              </ThemedText>
              <ThemedText type="body">{formatDate(selected)}</ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.textSecondary}
            />
          </Card>
        </Pressable>

        {/* Time */}
        <Pressable onPress={() => setShowTime(true)}>
          <Card style={styles.pickerRow}>
            <Ionicons
              name="time-outline"
              size={22}
              color={theme.textSecondary}
            />
            <View style={styles.pickerText}>
              <ThemedText type="small" themeColor="textSecondary">
                Time
              </ThemedText>
              <ThemedText type="body">{formatTime(selected)}</ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.textSecondary}
            />
          </Card>
        </Pressable>

        {!isFuture ? (
          <ThemedText type="small" themeColor="danger">
            Please choose a future time.
          </ThemedText>
        ) : null}

        <Button
          label="Save new time"
          size="lg"
          onPress={handleSave}
          loading={reschedule.isPending}
          disabled={!canSave}
        />
      </ScrollView>

      {showDate ? (
        <DateTimePicker
          value={selected}
          mode="date"
          minimumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowDate(false);
            if (event.type === 'dismissed' || !date) return;
            const merged = new Date(date);
            merged.setHours(selected.getHours(), selected.getMinutes());
            setSelected(merged);
          }}
        />
      ) : null}

      {showTime ? (
        <DateTimePicker
          value={selected}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowTime(false);
            if (event.type === 'dismissed' || !date) return;
            const merged = new Date(selected);
            merged.setHours(date.getHours(), date.getMinutes());
            setSelected(merged);
          }}
        />
      ) : null}
    </SafeAreaView>
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
    gap: Spacing.three,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pickerText: { flex: 1, gap: 2 },
});