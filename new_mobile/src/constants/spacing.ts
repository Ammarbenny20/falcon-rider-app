// src/constants/spacing.ts

/**
 * Spacing scale. All layout gaps, paddings, and margins should use these.
 */
export const Spacing = {
  none: 0,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 48,
  ten: 64,
} as const;

export type SpacingKey = keyof typeof Spacing;