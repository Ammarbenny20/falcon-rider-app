// src/features/routes/hooks/useGeocodeSearch.ts

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { routesApi } from '@/features/routes/api/routes.api';
import { geocodingMock } from '@/features/routes/services/geocoding.mock';
import type { PlaceSearchResult } from '@/features/routes/types/routes.types';
import { env } from '@/config/env';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

/**
 * Search for places with debounce and stale-request protection.
 *
 * - Debounces by 300ms
 * - Requires >= 2 chars
 * - Returns empty array for empty query
 * - Uses mock data when env.useMockGeocoding is true
 */
export function useGeocodeSearch(query: string) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const trimmed = debounced.trim();
  const enabled = trimmed.length >= MIN_QUERY_LENGTH;

  return useQuery<PlaceSearchResult[]>({
    queryKey: ['geocode', trimmed],
    queryFn: async () => {
      if (env.useMockGeocoding) {
        return geocodingMock.search(trimmed);
      }
      const response = await routesApi.geocode(trimmed);
      return response.results;
    },
    enabled,
    staleTime: 60_000,
    // Keep previous results visible while fetching new ones
    placeholderData: (prev) => prev,
  });
}