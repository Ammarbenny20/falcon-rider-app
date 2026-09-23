// src/constants/radii.ts

/**
 * Border radius scale.
 *
 * `full` is used for pills and circular elements.
 */
export const Radii = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type RadiiKey = keyof typeof Radii;