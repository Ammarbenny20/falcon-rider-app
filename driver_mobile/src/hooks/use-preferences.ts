// src/hooks/use-preferences.ts

import { useEffect } from 'react';

import { usePreferencesStore } from '@/store/preferences.store';

/**
 * Public preferences hook.
 * Auto-loads preferences on first mount.
 */
export function usePreferences() {
  const store = usePreferencesStore();
  const load = usePreferencesStore((s) => s.load);
  const isLoaded = usePreferencesStore((s) => s.isLoaded);

  useEffect(() => {
    if (!isLoaded) void load();
  }, [isLoaded, load]);

  return store;
}