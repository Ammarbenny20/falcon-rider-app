// src/app/passenger/options.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { eligibleModesFor } from '@/features/rider-requests/constants/ride-options';
import type { TransportMode } from '@/features/rider-requests/types/riderRequest.types';
import { useRideDraftStore } from '@/store/ride-draft.store';
import { useTheme } from '@/hooks/use-theme';

type ModeMeta = {
  price: string;
  driverEta: string;
  tripDuration: string;
  availableSeats?: number;
};

const MODE_META: Record<TransportMode, ModeMeta> = {
  BODA: { price: 'TZS 2,500', driverEta: '~3 min', tripDuration: '~15 min' },
  BAJAI: {
    price: 'TZS 3,500',
    driverEta: '~6 min',
    tripDuration: '~22 min',
    availableSeats: 2,
  },
  CAR: {
    price: 'TZS 5,000',
    driverEta: '~4 min',
    tripDuration: '~18 min',
    availableSeats: 3,
  },
  VAN: {
    price: 'TZS 7,000',
    driverEta: '~8 min',
    tripDuration: '~25 min',
    availableSeats: 5,
  },
  BUS: {
    price: 'TZS 4,000',
    driverEta: '~12 min',
    tripDuration: '~35 min',
    availableSeats: 12,
  },
};

export default function OptionsScreen() {
  const router = useRouter();
  const theme = useTheme();

  const rideAccessType = useRideDraftStore((s) => s.rideAccessType);
  const transportMode = useRideDraftStore((s) => s.transportMode);
  const setTransportMode = useRideDraftStore((s) => s.setTransportMode);
  const seatsNeeded = useRideDraftStore((s) => s.seatsNeeded);

  const isShared = rideAccessType === 'SHARED';
  const eligible = eligibleModesFor(rideAccessType);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">Choose your ride</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: theme.backgroundSelected },
            ]}
          >
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              {isShared ? 'Shared' : 'Private'}
            </ThemedText>
          </View>
        </View>

        {eligible.map((option) => {
          const meta = MODE_META[option.mode];
          const selected = transportMode === option.mode;

          return (
            <Pressable
              key={option.mode}
              onPress={() => setTransportMode(option.mode)}
            >
              <Card
                style={[
                  styles.optionCard,
                  selected && {
                    borderColor: theme.primary,
                    borderWidth: 2,
                  },
                ]}
              >
                <View style={styles.optionRow}>
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: theme.backgroundSelected },
                    ]}
                  >
                    <Ionicons
                      name={option.icon as keyof typeof Ionicons.glyphMap}
                      size={26}
                      color={theme.primary}
                    />
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText type="body">{option.label}</ThemedText>
                    {isShared && meta.availableSeats !== undefined ? (
                      <ThemedText type="small" themeColor="textSecondary">
                        {meta.availableSeats} seats available
                      </ThemedText>
                    ) : null}
                    <ThemedText type="small" themeColor="textSecondary">
                      Driver ETA {meta.driverEta} · Trip {meta.tripDuration}
                    </ThemedText>
                  </View>

                  <ThemedText type="body" style={{ fontWeight: '600' }}>
                    {meta.price}
                  </ThemedText>
                </View>

                {selected ? (
                  <View style={styles.selectedRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={theme.primary}
                    />
                    <ThemedText type="small" style={{ color: theme.primary }}>
                      Selected · {seatsNeeded} passenger
                      {seatsNeeded > 1 ? 's' : ''}
                    </ThemedText>
                  </View>
                ) : null}
              </Card>
            </Pressable>
          );
        })}

        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={{ textAlign: 'center', marginTop: Spacing.three }}
        >
          Live availability is mocked for now. Real-time updates arrive in
          Phase 3.
        </ThemedText>

        <Button
          label="Review"
          size="lg"
          onPress={() => router.push('/passenger/review')}
          disabled={!transportMode}
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
    gap: Spacing.three,
    paddingBottom: Spacing.eight,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: Spacing.one,
  },
  typeBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 999,
  },
  optionCard: {
    gap: Spacing.two,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});