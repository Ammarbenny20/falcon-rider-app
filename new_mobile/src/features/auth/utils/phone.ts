// src/features/auth/utils/phone.ts

/**
 * Phone utilities.
 *
 * For Phase 1, we assume a single-country (Tanzania, +255) input model.
 * The functions are written so multi-country support can be added later
 * without breaking callers.
 */

export const DEFAULT_COUNTRY_CODE = '+255';

/**
 * Strip everything that is not a digit or a leading '+'.
 */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Format a phone number for display.
 *
 * Currently just returns the normalized form. Preserved as a single point
 * of change for future formatting rules.
 */
export function formatPhone(input: string): string {
  return normalizePhone(input);
}