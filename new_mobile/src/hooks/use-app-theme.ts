// src/hooks/use-app-theme.ts

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { usePreferencesStore } from '@/store/preferences.store';

type Scheme = 'light' | 'dark';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const themePreference = usePreferencesStore((s) => s.theme);

  // Resolve effective scheme with safe fallback.
  // useColorScheme() can return null or 'unspecified' on some platforms.
  const effectiveScheme: Scheme =
    themePreference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  const theme = Colors[effectiveScheme];

  return {
    scheme: effectiveScheme,
    theme,
    preference: themePreference,
  };
}