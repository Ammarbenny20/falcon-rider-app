// src/constants/radii.ts

export const Radii = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type RadiiKey = keyof typeof Radii;