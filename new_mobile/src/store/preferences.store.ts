// src/store/preferences.store.ts

import { create } from 'zustand';

import { localStorage } from '@/services/storage/local-storage';

const STORAGE_KEY = 'app.preferences.v1';

export type AppLanguage = 'en' | 'sw';
export type AppThemePreference = 'system' | 'light' | 'dark';

export type Preferences = {
  language: AppLanguage;
  theme: AppThemePreference;
};

const DEFAULT_PREFERENCES: Preferences = {
  language: 'en',
  theme: 'system',
};

type PreferencesState = Preferences & {
  isLoaded: boolean;
  load: () => Promise<void>;
  setLanguage: (language: AppLanguage) => Promise<void>;
  setTheme: (theme: AppThemePreference) => Promise<void>;
  reset: () => Promise<void>;
};

async function persist(prefs: Preferences): Promise<void> {
  try {
    await localStorage.set(STORAGE_KEY, prefs);
  } catch {
    // Non-fatal. Store remains in memory.
  }
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...DEFAULT_PREFERENCES,
  isLoaded: false,

  load: async () => {
    try {
      const stored = await localStorage.get<Preferences>(STORAGE_KEY);
      set({
        ...DEFAULT_PREFERENCES,
        ...(stored ?? {}),
        isLoaded: true,
      });
    } catch {
      set({ ...DEFAULT_PREFERENCES, isLoaded: true });
    }
  },

  setLanguage: async (language) => {
    set({ language });
    await persist({ language, theme: get().theme });
  },

  setTheme: async (theme) => {
    set({ theme });
    await persist({ language: get().language, theme });
  },

  reset: async () => {
    set({ ...DEFAULT_PREFERENCES });
    await persist(DEFAULT_PREFERENCES);
  },
}));