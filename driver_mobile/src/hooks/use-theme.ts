// src/hooks/use-theme.ts

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme();

  // Resolve scheme with safe fallback
  const effectiveScheme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[effectiveScheme];
}