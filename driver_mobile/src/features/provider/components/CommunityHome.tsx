// src/features/provider/components/CommunityHome.tsx

import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';

export function CommunityHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Card style={styles.heroCard}>
        <ThemedText type="title3">Share a journey</ThemedText>
        <ThemedText type="body" themeColor="textSecondary">
          Going somewhere? Fill your empty seats and share the cost.
        </ThemedText>
        <Button
          label="Share a journey"
          size="lg"
          onPress={() => router.push('/journey/create' as never)}
        />
      </Card>

      <View style={styles.upcoming}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Upcoming journeys
        </ThemedText>
        <Card style={styles.emptyCard}>
          <ThemedText type="body" themeColor="textSecondary">
            No upcoming journeys
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Journeys you publish will appear here.
          </ThemedText>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.five },
  heroCard: { gap: Spacing.three },
  upcoming: { gap: Spacing.two },
  emptyCard: { gap: Spacing.one },
});