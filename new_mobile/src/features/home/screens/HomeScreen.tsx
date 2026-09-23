// src/features/home/screens/HomeScreen.tsx

import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Logo } from '@/components/ui/Logo';
import { Spacing } from '@/constants/spacing';
import { useMe } from '@/features/auth/hooks/useMe';
import { useUserStore } from '@/features/auth/store/user.store';
import { RecentDestinations } from '@/features/home/components/RecentDestinations';
import { SavedPlacesRow } from '@/features/home/components/SavedPlacesRow';
import { SearchCard } from '@/features/home/components/SearchCard';
import type { SavedPlace } from '@/features/places/types/place.types';
import { useSavedPlacesStore } from '@/features/places/store/savedPlaces.store';
import { UpcomingRideCard } from '@/features/rider-requests/components/UpcomingRideCard';
import { useUpcomingRide } from '@/features/scheduled/hooks/useUpcomingRide';

export default function HomeScreen() {
  const router = useRouter();

  const { data: user } = useMe();
  const cachedUser = useUserStore((s) => s.user);
  const displayUser = user ?? cachedUser;

  const firstName = displayUser?.full_name?.split(' ')[0] ?? 'there';

  const loadPlaces = useSavedPlacesStore((s) => s.load);
  const isPlacesLoaded = useSavedPlacesStore((s) => s.isLoaded);

  const { data: upcomingRide } = useUpcomingRide();

  useEffect(() => {
    if (!isPlacesLoaded) {
      void loadPlaces();
    }
  }, [isPlacesLoaded, loadPlaces]);

  const goToSearch = () => {
    router.push('/passenger/search');
  };

  const handleSelectSavedPlace = (place: SavedPlace) => {
    router.push({
      pathname: '/passenger/map-select',
      params: {
        placeId: place.id,
        placeName: place.label,
        placeAddress: place.address,
        placeLat: String(place.latitude),
        placeLng: String(place.longitude),
      },
    });
  };

  const handleAddPlace = () => {
    router.push('/passenger/search');
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Logo size="sm" variant="circle" />
          <ThemedText type="title2">Hi, {firstName}</ThemedText>
        </View>

        {/* Primary CTA */}
        <SearchCard onPress={goToSearch} />

        {/* Upcoming ride (if any) */}
        {upcomingRide ? <UpcomingRideCard ride={upcomingRide} /> : null}

        {/* Saved places */}
        <SavedPlacesRow
          onSelectPlace={handleSelectSavedPlace}
          onAddPlace={handleAddPlace}
        />

        {/* Recent destinations */}
        <RecentDestinations destinations={[]} onSelect={() => {}} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: Spacing.five,
    paddingBottom: Spacing.eight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
});