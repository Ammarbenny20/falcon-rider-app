// src/features/places/types/place.types.ts

/**
 * A place with coordinates and a human-readable label.
 * Used everywhere coordinates + label are needed (draft, saved places, etc.).
 */
export type PlaceSelection = {
  label: string;
  latitude: number;
  longitude: number;
};

/**
 * Saved place type. Kept as a discriminated union so future types
 * (SCHOOL, GYM, CUSTOM, ...) can be added without breaking existing code.
 */
export type SavedPlaceType = 'HOME' | 'WORK' | 'CUSTOM';

/**
 * A user-saved place. Persisted locally (AsyncStorage).
 * Rendered in the "Saved places" section on Home.
 */
export type SavedPlace = {
  id: string;
  type: SavedPlaceType;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
};