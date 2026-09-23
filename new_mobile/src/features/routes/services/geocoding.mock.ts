// src/features/routes/services/geocoding.mock.ts

import type { PlaceSearchResult } from '@/features/routes/types/routes.types';

/**
 * Mock geocoding data for development. Used when
 * EXPO_PUBLIC_USE_MOCK_GEOCODING=true.
 *
 * Contains Dar es Salaam landmarks for realistic demo.
 */
const MOCK_PLACES: PlaceSearchResult[] = [
  { id: '1', name: 'Mlimani City Mall', address: 'Sam Nujoma Road, Dar es Salaam', latitude: -6.7723, longitude: 39.2226 },
  { id: '2', name: 'Mlimani University', address: 'University of Dar es Salaam', latitude: -6.7771, longitude: 39.2083 },
  { id: '3', name: 'Kariakoo Market', address: 'Kariakoo, Dar es Salaam', latitude: -6.8160, longitude: 39.2833 },
  { id: '4', name: 'Posta', address: 'Downtown, Dar es Salaam', latitude: -6.8160, longitude: 39.2870 },
  { id: '5', name: 'Julius Nyerere International Airport', address: 'Terminal 3, Dar es Salaam', latitude: -6.8780, longitude: 39.2026 },
  { id: '6', name: 'Mikocheni', address: 'Mikocheni, Dar es Salaam', latitude: -6.7562, longitude: 39.2597 },
  { id: '7', name: 'Masaki', address: 'Masaki Peninsula, Dar es Salaam', latitude: -6.7493, longitude: 39.2745 },
  { id: '8', name: 'Sinza', address: 'Sinza, Dar es Salaam', latitude: -6.7853, longitude: 39.2500 },
  { id: '9', name: 'Kimara', address: 'Kimara, Dar es Salaam', latitude: -6.8269, longitude: 39.1920 },
  { id: '10', name: 'Ubungo Bus Terminal', address: 'Ubungo, Dar es Salaam', latitude: -6.7917, longitude: 39.2094 },
  { id: '11', name: 'Oyster Bay', address: 'Oyster Bay, Dar es Salaam', latitude: -6.7682, longitude: 39.2838 },
  { id: '12', name: 'Tabata', address: 'Tabata, Dar es Salaam', latitude: -6.8287, longitude: 39.2216 },
  { id: '13', name: 'Mbezi Beach', address: 'Mbezi Beach, Dar es Salaam', latitude: -6.7204, longitude: 39.2627 },
  { id: '14', name: 'Kigamboni', address: 'Kigamboni, Dar es Salaam', latitude: -6.8320, longitude: 39.3160 },
  { id: '15', name: 'Magomeni', address: 'Magomeni, Dar es Salaam', latitude: -6.8020, longitude: 39.2660 },
];

/**
 * Simulated network delay for realistic UX testing.
 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const geocodingMock = {
  async search(query: string): Promise<PlaceSearchResult[]> {
    await delay(300);

    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return MOCK_PLACES.filter(
      (place) =>
        place.name.toLowerCase().includes(normalized) ||
        place.address.toLowerCase().includes(normalized),
    );
  },
};