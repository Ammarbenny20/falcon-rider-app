// src/hooks/use-app-theme.ts

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { usePreferencesStore } from '@/store/preferences.store';

type Scheme = 'light' | 'dark';

/**
 * Returns the effective color scheme and theme object.
 * Priority: user preference → system → light.
 */
export function useAppTheme() {
  const systemScheme = useColorScheme();
  const themePreference = usePreferencesStore((s) => s.theme);

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