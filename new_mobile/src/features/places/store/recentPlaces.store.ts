// src/features/places/store/recentPlaces.store.ts

import { create } from 'zustand';

import { localStorage } from '@/services/storage/local-storage';
import type { SavedPlace } from '@/features/places/types/place.types';

const STORAGE_KEY = 'recent_places.v1';
const MAX_RECENT = 5;

type RecentPlacesState = {
  recents: SavedPlace[];
  isLoaded: boolean;
  load: () => Promise<void>;
  addRecent: (place: Omit<SavedPlace, 'id' | 'type'>) => Promise<void>;
  clear: () => Promise<void>;
};

export const useRecentPlacesStore = create<RecentPlacesState>((set, get) => ({
  recents: [],
  isLoaded: false,

  load: async () => {
    try {
      const stored = await localStorage.get<SavedPlace[]>(STORAGE_KEY);
      set({ recents: stored ?? [], isLoaded: true });
    } catch {
      set({ recents: [], isLoaded: true });
    }
  },

  addRecent: async (place) => {
    const entry: SavedPlace = {
      ...place,
      id: `recent-${Date.now()}`,
      type: 'CUSTOM',
    };
    // Remove duplicates by label, keep newest
    const filtered = get().recents.filter(
      (p) => p.label.toLowerCase() !== place.label.toLowerCase(),
    );
    const next = [entry, ...filtered].slice(0, MAX_RECENT);
    set({ recents: next });
    try {
      await localStorage.set(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  },

  clear: async () => {
    set({ recents: [] });
    try {
      await localStorage.set(STORAGE_KEY, []);
    } catch {
      // ignore
    }
  },
}));