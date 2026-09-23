// src/app/passenger/plan.tsx

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import type {
  BookingType,
  RideAccessType,
} from '@/features/rider-requests/types/riderRequest.types';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { useRideDraftStore } from '@/store/ride-draft.store';
import { useTheme } from '@/hooks/use-theme';

/**
 * Default scheduled time: 30 minutes from now.
 */
function defaultScheduledTime(): Date {
  return new Date(Date.now() + 30 * 60 * 1000);
}

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

export default function PlanScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { status, place, reload } = useCurrentLocation();

  const pickup = useRideDraftStore((s) => s.pickup);
  const destination = useRideDraftStore((s) => s.destination);
  const setPickup = useRideDraftStore((s) => s.setPickup);
  const bookingType = useRideDraftStore((s) => s.bookingType);
  const setBookingType = useRideDraftStore((s) => s.setBookingType);
  const scheduledFor = useRideDraftStore((s) => s.scheduledFor);
  const setScheduledFor = useRideDraftStore((s) => s.setScheduledFor);
  const rideAccessType = useRideDraftStore((s) => s.rideAccessType);
  const setRideAccessType = useRideDraftStore((s) => s.setRideAccessType);
  const seatsNeeded = useRideDraftStore((s) => s.seatsNeeded);
  const setSeatsNeeded = useRideDraftStore((s) => s.setSeatsNeeded);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Auto-fill pickup from current location
  useEffect(() => {
    if (!pickup && status === 'granted' && place) {
      setPickup(place);
    }
  }, [pickup, status, place, setPickup]);

  // Auto-fill scheduled time when switching to SCHEDULED
  useEffect(() => {
    if (bookingType === 'SCHEDULED' && !scheduledFor) {
      setScheduledFor(defaultScheduledTime().toISOString());
    }
  }, [bookingType, scheduledFor, setScheduledFor]);

  // Reset scheduled time when switching back to NOW
  useEffect(() => {
    if (bookingType === 'NOW' && scheduledFor) {
      setScheduledFor(null);
    }
  }, [bookingType, scheduledFor, setScheduledFor]);

  const scheduledDate = scheduledFor ? new Date(scheduledFor) : null;

  const hasScheduledTime =
    bookingType === 'NOW' || (scheduledDate !== null && scheduledDate > new Date());

  const canContinue =
    Boolean(pickup && destination) && hasScheduledTime;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">Plan your ride</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        {/* Pickup */}
        <Card style={styles.rowCard}>
          <View style={[styles.dot, { backgroundColor: theme.primary }]} />
          <View style={styles.rowText}>
            <ThemedText type="small" themeColor="textSecondary">
              Pickup
            </ThemedText>
            <ThemedText type="body" numberOfLines={1}>
              {pickup?.label ??
                (status === 'loading' ? 'Finding your location…' : 'Not set')}
            </ThemedText>
          </View>
          {status !== 'granted' ? (
            <Pressable onPress={reload} hitSlop={8}>
              <ThemedText type="small" style={{ color: theme.primary }}>
                Retry
              </ThemedText>
            </Pressable>
          ) : null}
        </Card>

        {/* Destination */}
        <Card style={styles.rowCard}>
          <Ionicons name="location" size={14} color={theme.danger} />
          <View style={styles.rowText}>
            <ThemedText type="small" themeColor="textSecondary">
              Destination
            </ThemedText>
            <ThemedText type="body" numberOfLines={1}>
              {destination?.label ?? 'Not selected'}
            </ThemedText>
          </View>
          <Pressable
            onPress={() => router.push('/passenger/search')}
            hitSlop={8}
          >
            <ThemedText type="small" style={{ color: theme.primary }}>
              {destination ? 'Change' : 'Select'}
            </ThemedText>
          </Pressable>
        </Card>

        {/* When — Now vs Scheduled */}
        <Card style={styles.blockCard}>
          <ThemedText type="small" themeColor="textSecondary">
            When
          </ThemedText>
          <View style={styles.segment}>
            <SegmentButton
              label="Now"
              active={bookingType === 'NOW'}
              onPress={() => setBookingType('NOW')}
            />
            <SegmentButton
              label="Book for later"
              active={bookingType === 'SCHEDULED'}
              onPress={() => setBookingType('SCHEDULED')}
            />
          </View>

          {/* Inline Date + Time pickers (only when SCHEDULED) */}
          {bookingType === 'SCHEDULED' ? (
            <View style={styles.scheduleBlock}>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.scheduleRow,
                  { borderColor: theme.border },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.textSecondary}
                />
                <View style={{ flex: 1 }}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Date
                  </ThemedText>
                  <ThemedText type="body">
                    {scheduledDate
                      ? formatDate(scheduledDate)
                      : 'Select date'}
                  </ThemedText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>

              <Pressable
                onPress={() => setShowTimePicker(true)}
                style={[
                  styles.scheduleRow,
                  { borderColor: theme.border },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={theme.textSecondary}
                />
                <View style={{ flex: 1 }}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Time
                  </ThemedText>
                  <ThemedText type="body">
                    {scheduledDate
                      ? formatTime(scheduledDate)
                      : 'Select time'}
                  </ThemedText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.textSecondary}
                />
              </Pressable>

              {!hasScheduledTime && scheduledDate ? (
                <ThemedText type="small" themeColor="danger">
                  Please choose a future time.
                </ThemedText>
              ) : null}
            </View>
          ) : null}
        </Card>

        {/* Ride access type — Private vs Shared */}
        <Card style={styles.blockCard}>
          <ThemedText type="small" themeColor="textSecondary">
            Ride type
          </ThemedText>

          <View style={styles.accessOptions}>
            <AccessOption
              title="Private"
              description="Just you and your group"
              icon="car-sport-outline"
              selected={rideAccessType === 'PRIVATE'}
              onPress={() => setRideAccessType('PRIVATE')}
            />
            <AccessOption
              title="Shared"
              description="Share available capacity with other riders"
              icon="people-outline"
              selected={rideAccessType === 'SHARED'}
              onPress={() => setRideAccessType('SHARED')}
            />
          </View>
        </Card>

        {/* Seats */}
        <Card style={styles.rowCard}>
          <Ionicons
            name="person-outline"
            size={18}
            color={theme.textSecondary}
          />
          <View style={styles.rowText}>
            <ThemedText type="small" themeColor="textSecondary">
              Passengers
            </ThemedText>
            <ThemedText type="body">{seatsNeeded}</ThemedText>
          </View>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setSeatsNeeded(Math.max(1, seatsNeeded - 1))}
              style={[styles.stepperBtn, { borderColor: theme.border }]}
            >
              <Ionicons name="remove" size={18} color={theme.text} />
            </Pressable>
            <Pressable
              onPress={() => setSeatsNeeded(Math.min(6, seatsNeeded + 1))}
              style={[styles.stepperBtn, { borderColor: theme.border }]}
            >
              <Ionicons name="add" size={18} color={theme.text} />
            </Pressable>
          </View>
        </Card>

        <View style={{ height: Spacing.four }} />

        <Button
          label="Continue"
          size="lg"
          onPress={() => router.push('/passenger/options')}
          disabled={!canContinue}
        />
      </ScrollView>

      {/* Date Picker (native modal) */}
      {showDatePicker && scheduledDate ? (
        <DateTimePicker
          value={scheduledDate}
          mode="date"
          minimumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (event.type === 'dismissed' || !date) return;

            // Preserve current time when changing date
            const merged = new Date(date);
            if (scheduledDate) {
              merged.setHours(
                scheduledDate.getHours(),
                scheduledDate.getMinutes(),
              );
            }
            setScheduledFor(merged.toISOString());
          }}
        />
      ) : null}

      {/* Time Picker (native modal) */}
      {showTimePicker && scheduledDate ? (
        <DateTimePicker
          value={scheduledDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (event.type === 'dismissed' || !date) return;

            // Preserve current date when changing time
            const merged = new Date(scheduledDate);
            merged.setHours(date.getHours(), date.getMinutes());
            setScheduledFor(merged.toISOString());
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

// --- Helper components ---

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.segmentBtn,
        {
          backgroundColor: active ? theme.background : 'transparent',
          borderColor: active ? theme.primary : 'transparent',
        },
      ]}
    >
      <ThemedText
        type="smallBold"
        style={{ color: active ? theme.primary : theme.textSecondary }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function AccessOption({
  title,
  description,
  icon,
  selected,
  onPress,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.accessOption,
        {
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected ? theme.backgroundSelected : 'transparent',
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={24}
        color={selected ? theme.primary : theme.textSecondary}
      />
      <View style={{ flex: 1 }}>
        <ThemedText type="body">{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    paddingBottom: Spacing.eight,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  blockCard: {
    gap: Spacing.three,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  rowText: { flex: 1, gap: 2 },
  stepper: { flexDirection: 'row', gap: Spacing.two },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  scheduleBlock: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: 10,
  },
  accessOptions: {
    gap: Spacing.two,
  },
  accessOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});