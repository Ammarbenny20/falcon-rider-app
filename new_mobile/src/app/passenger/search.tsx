// src/app/passenger/search.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useGeocodeSearch } from '@/features/routes/hooks/useGeocodeSearch';
import { SearchResultItem } from '@/features/routes/components/SearchResultItem';
import type { PlaceSearchResult } from '@/features/routes/types/routes.types';
import { useRecentPlacesStore } from '@/features/places/store/recentPlaces.store';
import { useTheme } from '@/hooks/use-theme';

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const { data: results, isFetching, isError, error } = useGeocodeSearch(query);

  const recents = useRecentPlacesStore((s) => s.recents);
  const loadRecents = useRecentPlacesStore((s) => s.load);
  const isRecentsLoaded = useRecentPlacesStore((s) => s.isLoaded);

  useEffect(() => {
    if (!isRecentsLoaded) void loadRecents();
  }, [isRecentsLoaded, loadRecents]);

  const hasQuery = query.trim().length >= 2;
  const showRecents = !hasQuery && recents.length > 0;
  const showResults = hasQuery && results && results.length > 0;
  const showEmpty = hasQuery && !isFetching && !isError && results?.length === 0;

  const handleSelect = (place: PlaceSearchResult) => {
    Keyboard.dismiss();
    router.push({
      pathname: '/passenger/map-select',
      params: {
        placeId: place.id,
        placeName: place.name,
        placeAddress: place.address,
        placeLat: String(place.latitude),
        placeLng: String(place.longitude),
      },
    });
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>

        <View
          style={[
            styles.searchField,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="search" size={18} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Where are you going?"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            autoFocus
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Body */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollBody}
      >
        {isFetching && hasQuery ? (
          <View style={styles.centered}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : null}

        {showRecents ? (
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Recent
            </ThemedText>
            {recents.map((place) => (
              <SearchResultItem
                key={place.id}
                place={{
                  id: place.id,
                  name: place.label,
                  address: place.address,
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                onPress={handleSelect}
                icon="time-outline"
              />
            ))}
          </View>
        ) : null}

        {showResults ? (
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Results
            </ThemedText>
            {results!.map((place) => (
              <SearchResultItem
                key={place.id}
                place={place}
                onPress={handleSelect}
              />
            ))}
          </View>
        ) : null}

        {showEmpty ? (
          <View style={styles.centered}>
            <ThemedText type="body" themeColor="textSecondary">
              No places found.
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Try a different name or nearby landmark.
            </ThemedText>
          </View>
        ) : null}

        {isError ? (
          <View style={styles.centered}>
            <ThemedText type="body" themeColor="danger">
              Couldn't load destinations.
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {error instanceof Error ? error.message : 'Check your connection.'}
            </ThemedText>
          </View>
        ) : null}

        {!hasQuery && !showRecents ? (
          <View style={styles.centered}>
            <ThemedText type="body" themeColor="textSecondary">
              Start typing to search destinations.
            </ThemedText>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 48,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.two,
  },
  scrollBody: {
    paddingBottom: Spacing.six,
  },
  section: {
    paddingTop: Spacing.three,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.eight,
    gap: Spacing.one,
  },
});