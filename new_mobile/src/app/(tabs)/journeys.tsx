// src/app/(tabs)/journeys.tsx

import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Spacing } from '@/constants/spacing';
import type { Journey } from '@/features/journeys/types/journey.types';

type Segment = 'upcoming' | 'past';

export default function JourneysScreen() {
  const [segment, setSegment] = useState<Segment>('upcoming');

  // Phase 2: no backend data. Renders empty state.
  // Phase 3: will fetch from useJourneys().
  const upcoming: Journey[] = [];
  const past: Journey[] = [];

  const journeys = segment === 'upcoming' ? upcoming : past;
  const isEmpty = journeys.length === 0;

  return (
    <Screen>
      <View style={styles.container}>
        <ThemedText type="title1">My Journeys</ThemedText>

        <SegmentedControl<Segment>
          options={[
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Past', value: 'past' },
          ]}
          value={segment}
          onChange={setSegment}
        />

        {isEmpty ? (
          <EmptyState
            icon="navigate-outline"
            title={
              segment === 'upcoming'
                ? 'No upcoming journeys'
                : 'No past journeys'
            }
            description={
              segment === 'upcoming'
                ? 'Your upcoming rides will appear here.'
                : 'Your completed rides will appear here.'
            }
          />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {/* Phase 3: map journeys to <JourneyCard /> */}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.four,
  },
  list: {
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
});