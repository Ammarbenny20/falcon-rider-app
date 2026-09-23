// src/app/passenger/map-select.tsx

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MapPreview } from '@/components/map/MapPreview';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useRideDraftStore } from '@/store/ride-draft.store';
import { useTheme } from '@/hooks/use-theme';

export default function MapSelectScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{
    placeId: string;
    placeName: string;
    placeAddress: string;
    placeLat: string;
    placeLng: string;
  }>();

  const setDestination = useRideDraftStore((s) => s.setDestination);

  const latitude = Number(params.placeLat);
  const longitude = Number(params.placeLng);

  const handleConfirm = () => {
    setDestination({
      label: params.placeName ?? '',
      latitude,
      longitude,
    });
    router.push('/passenger/plan');
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={26}
          color={theme.text}
          onPress={() => router.back()}
        />
        <ThemedText type="body">Confirm destination</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.mapWrap}>
        <MapPreview
          latitude={latitude}
          longitude={longitude}
          label={params.placeName}
        />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Card style={styles.card}>
          <ThemedText type="title3" numberOfLines={2}>
            {params.placeName}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary">
            {params.placeAddress}
          </ThemedText>
        </Card>

        <Button
          label="Confirm destination"
          size="lg"
          onPress={handleConfirm}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  mapWrap: {
    flex: 1,
    margin: Spacing.four,
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  card: { gap: Spacing.two },
});