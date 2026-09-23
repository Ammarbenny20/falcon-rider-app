// src/app/journey/create.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useCreateJourney } from '@/features/journey/hooks/useCreateJourney';
import type { TransportMode } from '@/features/journey/types/journey.types';
import { useTheme } from '@/hooks/use-theme';

export default function CreateJourneyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const create = useCreateJourney();

  const [originLabel, setOriginLabel] = useState('');
  const [destinationLabel, setDestinationLabel] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [seats, setSeats] = useState('2');
  const [mode, setMode] = useState<TransportMode>('CAR');

  const handleSubmit = async () => {
    if (!originLabel || !destinationLabel || !departureTime) {
      Alert.alert('Missing info', 'Please fill all required fields.');
      return;
    }

    try {
      await create.mutateAsync({
        origin: {
          label: originLabel,
          latitude: -6.7924,
          longitude: 39.2083,
        },
        destination: {
          label: destinationLabel,
          latitude: -6.8235,
          longitude: 39.2695,
        },
        departure_time: new Date(departureTime).toISOString(),
        available_seats: parseInt(seats, 10) || 1,
        transport_mode: mode,
        // NOTE: price_per_seat is NOT set by the provider.
        // The backend calculates the cost-share contribution
        // based on distance, fuel, and the number of passengers.
        // See the info card below the form.
      });
      router.replace('/(tabs)/journeys');
    } catch (e) {
      Alert.alert(
        'Could not create journey',
        e instanceof Error ? e.message : 'Please try again.',
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">Create journey</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <ThemedText type="body" themeColor="textSecondary">
          Share a journey you are already making and fill empty seats.
        </ThemedText>

        <Input
          label="Origin"
          placeholder="e.g. Mbezi Beach"
          value={originLabel}
          onChangeText={setOriginLabel}
        />

        <Input
          label="Destination"
          placeholder="e.g. Posta"
          value={destinationLabel}
          onChangeText={setDestinationLabel}
        />

        <Input
          label="Departure time (YYYY-MM-DD HH:MM)"
          placeholder="2026-09-21 07:30"
          value={departureTime}
          onChangeText={setDepartureTime}
        />

        <Input
          label="Available seats"
          keyboardType="number-pad"
          value={seats}
          onChangeText={setSeats}
        />

        {/* Transport mode */}
        <Card style={styles.modeCard}>
          <ThemedText type="small" themeColor="textSecondary">
            Transport mode
          </ThemedText>
          <View style={styles.modeRow}>
            {(['CAR', 'VAN', 'BAJAI', 'BODA', 'BUS'] as TransportMode[]).map(
              (m) => (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  style={[
                    styles.modeBtn,
                    {
                      borderColor: mode === m ? theme.primary : theme.border,
                      backgroundColor:
                        mode === m
                          ? theme.backgroundSelected
                          : 'transparent',
                    },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{
                      color:
                        mode === m ? theme.primary : theme.textSecondary,
                    }}
                  >
                    {m}
                  </ThemedText>
                </Pressable>
              ),
            )}
          </View>
        </Card>

        {/* Cost-share info card — replaces the price input */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIconWrap,
                { backgroundColor: theme.backgroundSelected },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={theme.primary}
              />
            </View>
            <View style={styles.infoTextCol}>
              <ThemedText type="bodyBold">
                Cost-share is calculated by Falcon Rider
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                You don't set the price. We calculate a fair cost-share for
                each rider based on the journey distance and the number of
                passengers. This keeps the platform transparent and legal.
              </ThemedText>
            </View>
          </View>
        </Card>

        <Button
          label="Publish journey"
          size="lg"
          onPress={handleSubmit}
          loading={create.isPending}
        />
      </ScrollView>
    </SafeAreaView>
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
    gap: Spacing.four,
  },
  modeCard: { gap: Spacing.three },
  modeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  modeBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  infoCard: { gap: Spacing.three },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextCol: { flex: 1, gap: Spacing.one },
});