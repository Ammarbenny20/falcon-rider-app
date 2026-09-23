// src/features/places/store/savedPlaces.store.ts

import { create } from 'zustand';

import { localStorage } from '@/services/storage/local-storage';
import type {
  SavedPlace,
  SavedPlaceType,
  PlaceSelection,
} from '@/features/places/types/place.types';

const STORAGE_KEY = 'saved_places.v1';

type SavedPlacesState = {
  places: SavedPlace[];
  isLoaded: boolean;

  // Lifecycle
  load: () => Promise<void>;
  reset: () => void;

  // Mutations
  saveHome: (place: PlaceSelection) => Promise<void>;
  saveWork: (place: PlaceSelection) => Promise<void>;
  addCustom: (place: PlaceSelection) => Promise<void>;
  removePlace: (id: string) => Promise<void>;

  // Selectors
  getByType: (type: SavedPlaceType) => SavedPlace | undefined;
};

/**
 * Generate a deterministic ID for Home and Work (single-instance types).
 * Custom places get a unique ID.
 */
function makeId(type: SavedPlaceType): string {
  if (type === 'HOME') return 'saved-home';
  if (type === 'WORK') return 'saved-work';
  return `saved-custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function persist(places: SavedPlace[]): Promise<void> {
  try {
    await localStorage.set(STORAGE_KEY, places);
  } catch {
    // Non-fatal. Store remains in memory for this session.
  }
}

export const useSavedPlacesStore = create<SavedPlacesState>((set, get) => ({
  places: [],
  isLoaded: false,

  load: async () => {
    try {
      const stored = await localStorage.get<SavedPlace[]>(STORAGE_KEY);
      set({ places: stored ?? [], isLoaded: true });
    } catch {
      set({ places: [], isLoaded: true });
    }
  },

  reset: () => {
    set({ places: [], isLoaded: false });
  },

  saveHome: async (place) => {
    await saveTyped('HOME', place, set, get);
  },

  saveWork: async (place) => {
    await saveTyped('WORK', place, set, get);
  },

  addCustom: async (place) => {
    await saveTyped('CUSTOM', place, set, get);
  },

  removePlace: async (id) => {
    const next = get().places.filter((p) => p.id !== id);
    set({ places: next });
    await persist(next);
  },

  getByType: (type) => {
    return get().places.find((p) => p.type === type);
  },
}));

/**
 * Save a place of a given type. Home and Work replace existing entries
 * (single-instance). Custom appends.
 */
async function saveTyped(
  type: SavedPlaceType,
  place: PlaceSelection,
  set: (partial: Partial<SavedPlacesState>) => void,
  get: () => SavedPlacesState,
): Promise<void> {
  const existing = get().places;

  const entry: SavedPlace = {
    id: makeId(type),
    type,
    label: place.label,
    address: place.label,
    latitude: place.latitude,
    longitude: place.longitude,
  };

  // Replace existing entry of same type, or append.
  const filtered = existing.filter((p) => p.type !== type);
  const next = [...filtered, entry];

  set({ places: next });
  await persist(next);
}