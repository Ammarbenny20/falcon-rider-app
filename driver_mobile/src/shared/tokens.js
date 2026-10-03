// ============================================
// FALCON RIDER DESIGN TOKENS
// Single Source of Truth for All Platforms
// ============================================

export const colors = {
  // Primary Palette
  primaryGreen: '#16A34A',
  darkGreen: '#166534',
  lightGreen: '#DCFCE7',
  navy: '#0F172A',
  white: '#FFFFFF',

  // Accent Colors
  amber: '#F59E0B',
  errorRed: '#DC2626',

  // Neutrals
  gray500: '#64748B',
  gray200: '#E2E8F0',
  gray50: '#F8FAFC',

  // Semantic Aliases
  success: '#16A34A',
  error: '#DC2626',
  warning: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  cta: '#F59E0B',
  brand: '#16A34A',
  brandDark: '#166534',
  brandLight: '#DCFCE7',
};

export const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
  mono: 'JetBrains Mono, monospace',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export default { colors, fonts, spacing, radius };
