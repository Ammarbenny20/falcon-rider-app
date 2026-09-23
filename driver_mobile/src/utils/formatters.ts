// src/utils/formatters.ts

/**
 * Format a currency amount.
 * Default currency is TZS (Tanzanian Shilling).
 */
export function formatCurrency(
  amount: number,
  currency = 'TZS',
): string {
  return `${currency} ${amount.toLocaleString()}`;
}

/**
 * Format a distance in meters to a human-readable string.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format a duration in seconds to a human-readable string.
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} sec`;
  }
  if (seconds < 3600) {
    return `${Math.round(seconds / 60)} min`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Format a date-time as "Today · HH:MM", "Tomorrow · HH:MM", or a full date.
 */
export function formatRelativeDateTime(iso: string | null): string {
  if (!iso) return '';

  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const time = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;

  return date.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}