// src/hooks/use-theme.ts

import { useAppTheme } from '@/hooks/use-app-theme';

/**
 * Legacy hook — kept for backward compatibility.
 * Returns just the theme colors object.
 *
 * New code should prefer `useAppTheme()` for scheme + preference access.
 */
export function useTheme() {
  return useAppTheme().theme;
}