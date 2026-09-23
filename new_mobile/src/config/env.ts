// src/config/env.ts

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

const useMockAuth =
  __DEV__ && process.env.EXPO_PUBLIC_USE_MOCK_AUTH === 'true';

const useMockGeocoding =
  __DEV__ && process.env.EXPO_PUBLIC_USE_MOCK_GEOCODING === 'true';

const mapProvider =
  (process.env.EXPO_PUBLIC_MAP_PROVIDER as 'react-native-maps' | 'mapbox') ??
  'react-native-maps';

export const env = {
  apiBaseUrl,
  useMockAuth,
  useMockGeocoding,
  mapProvider,
  devAuthBypassEnabled: false,
} as const;