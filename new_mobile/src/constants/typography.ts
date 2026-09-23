// src/constants/typography.ts

/**
 * Falcon Rider typographic scale.
 *
 * Semantic names. If we ever rebrand, only the values change — not the
 * names — so no consumer breaks.
 */
export const Typography = {
  display: { fontSize: 40, lineHeight: 48, fontWeight: '700' as const },
  title1: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  title2: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },
  title3: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  callout: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  subhead: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  code: { fontSize: 13, lineHeight: 20, fontWeight: '500' as const },
} as const;

export type TypographyVariant = keyof typeof Typography;