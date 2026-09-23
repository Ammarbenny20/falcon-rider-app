// src/app/(tabs)/journeys.tsx

import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { JourneyCard } from '@/features/journey/components/JourneyCard';
import { useJourneys } from '@/features/journey/hooks/useJourneys';

export default function JourneysScreen() {
  const router = useRouter();
  const { data: journeys, isLoading } = useJourneys();

  if (isLoading) return <LoadingState />;

  return (
    <Screen>
      <View style={styles.container}>
        <ThemedText type="title1">My Journeys</ThemedText>

        {!journeys || journeys.length === 0 ? (
          <EmptyState
            icon="map-outline"
            title="No journeys yet"
            description="Share a journey you are already making and fill empty seats."
            actionLabel="Share a journey"
            onAction={() => router.push('/journey/create' as never)}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {journeys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} />
            ))}
            <Button
              label="Share a journey"
              onPress={() => router.push('/journey/create' as never)}
            />
          </ScrollView>
        )}

        <Button
          label="Manage recurring journeys"
          variant="ghost"
          onPress={() => router.push('/journey/templates' as never)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: Spacing.four },
  list: { gap: Spacing.three, paddingBottom: Spacing.six },
});