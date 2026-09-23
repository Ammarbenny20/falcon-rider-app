/**
 * Falcon Rider Admin Portal — Formatting Utilities
 *
 * Centralized formatting for dates, currency, numbers, strings.
 * Ensures consistency across the entire admin portal.
 */

import { format, formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';

// ─────────────────────────────────────────
// DATE & TIME
// ─────────────────────────────────────────

/**
 * Format date as "Jan 15, 2026"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return '—';
  }
}

/**
 * Format date and time as "Jan 15, 2026 14:30"
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  } catch {
    return '—';
  }
}

/**
 * Format time as "14:30"
 */
export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  try {
    return format(new Date(date), 'HH:mm');
  } catch {
    return '—';
  }
}

/**
 * Format as relative time: "5 minutes ago", "in 2 hours"
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '—';
  }
}

/**
 * Format duration between two dates: "2h 15m"
 */
export function formatDurationBetween(
  start: string | Date,
  end: string | Date
): string {
  try {
    const duration = intervalToDuration({
      start: new Date(start),
      end: new Date(end),
    });
    return formatDuration(duration, { format: ['hours', 'minutes'] }) || '0m';
  } catch {
    return '—';
  }
}

/**
 * Format as short date for compact tables: "15 Jan"
 */
export function formatShortDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  try {
    return format(new Date(date), 'dd MMM');
  } catch {
    return '—';
  }
}

// ─────────────────────────────────────────
// CURRENCY & NUMBERS
// ─────────────────────────────────────────

/**
 * Format currency: "TZS 15,000"
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency = 'TZS'
): string {
  if (amount === null || amount === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/**
 * Format number with thousands separator: "15,000"
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage: "85.5%"
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals = 1
): string {
  if (value === null || value === undefined) return '—';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format compact number: "15K", "1.2M"
 */
export function formatCompactNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

// ─────────────────────────────────────────
// STRINGS
// ─────────────────────────────────────────

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length = 50): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return `${str.slice(0, length)}…`;
}

/**
 * Get initials from name: "John Doe" → "JD"
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Mask sensitive string: "1234567890" → "1234***890"
 */
export function maskString(
  str: string | null | undefined,
  visibleStart = 4,
  visibleEnd = 3
): string {
  if (!str) return '—';
  if (str.length <= visibleStart + visibleEnd) return str;
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const middle = '*'.repeat(Math.max(0, str.length - visibleStart - visibleEnd));
  return `${start}${middle}${end}`;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case: "hello world" → "Hello World"
 */
export function titleCase(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert snake_case or SCREAMING_SNAKE to Title Case
 * "PENDING_VERIFICATION" → "Pending Verification"
 */
export function humanizeStatus(status: string | null | undefined): string {
  if (!status) return '—';
  return titleCase(status.replace(/_/g, ' ').toLowerCase());
}

// ─────────────────────────────────────────
// IDS
// ─────────────────────────────────────────

/**
 * Format entity ID for display: "CU-000001"
 */
export function formatEntityId(
  prefix: string,
  id: string | number,
  padding = 6
): string {
  const num = String(id).padStart(padding, '0');
  return `${prefix}-${num}`;
}