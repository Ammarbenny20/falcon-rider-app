// src/constants/motion.ts

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