// src/constants/theme.ts
// ============================================
// FALCON RIDER - DRIVER APP THEME
// Uses shared design tokens
// ============================================

import { colors, fonts, spacing, radius } from '../shared/tokens';

export type ThemeColor =
  | 'text'
  | 'textSecondary'
  | 'textTertiary'
  | 'background'
  | 'backgroundElement'
  | 'backgroundSelected'
  | 'primary'
  | 'primaryDark'
  | 'primaryLight'
  | 'border'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info';

// ─── Falcon Rider Brand Colors ───────────────────────────────────────
// Primary: #16A34A (Falcon Green)
// Dark: #166534
// Light: #DCFCE7

export const theme = {
  colors: {
    // Backgrounds
    background: colors.white,
    backgroundElement: colors.gray50,
    backgroundSelected: colors.lightGreen,

    // Text
    text: colors.navy,
    textSecondary: colors.gray500,
    textTertiary: colors.gray500,

    // Brand
    primary: colors.primaryGreen,
    primaryDark: colors.darkGreen,
    primaryLight: colors.lightGreen,

    // Status
    danger: colors.errorRed,
    warning: colors.amber,
    success: colors.primaryGreen,
    info: colors.navy,

    // Borders
    border: colors.gray200,

    // CTA
    cta: colors.amber,
  },
  fonts,
  spacing,
  radius,
};

export default theme;
