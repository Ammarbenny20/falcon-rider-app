// src/constants/motion.ts

/**
 * Motion tokens.
 *
 * Durations are in milliseconds. Easing names map to Reanimated's built-in
 * easings; use the `Easing` module from 'react-native-reanimated' to resolve.
 */
export const Motion = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 400,
    deliberate: 600,
  },
  easing: {
    standard: 'easeInOut',
    enter: 'easeOut',
    exit: 'easeIn',
    spring: 'spring',
  },
} as const;