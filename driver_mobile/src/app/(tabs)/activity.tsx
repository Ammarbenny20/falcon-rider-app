// src/app/(tabs)/activity.tsx

import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Spacing } from '@/constants/spacing';
import { useTranslation } from '@/i18n';
import { useState } from 'react';

type ActivitySegment = 'requests' | 'active' | 'upcoming' | 'completed';

export default function ActivityScreen() {
  const t = useTranslation();
  const [segment, setSegment] = useState<ActivitySegment>('requests');

  // Phase 2: no backend data. Renders empty state.
  // Phase 3: will fetch from useTrips().
  const hasActivity = false;

  return (
    <Screen>
      <View style={styles.container}>
        <ThemedText type="title1">{t('tabs.activity')}</ThemedText>

        <SegmentedControl<ActivitySegment>
          options={[
            { label: 'Requests', value: 'requests' },
            { label: 'Active', value: 'active' },
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Completed', value: 'completed' },
          ]}
          value={segment}
          onChange={setSegment}
        />

        {!hasActivity ? (
          <EmptyState
            icon="pulse-outline"
            title="No activity yet"
            description="Your professional trips and requests will appear here."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {/* Phase 3: map trips to <TripCard /> */}
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