/**
 * Falcon Rider Admin Portal — Status Badge
 *
 * Consistent status display with semantic colors.
 * Uses both color AND text — accessibility compliant.
 */

import { cn } from '@/lib/utils/cn';
import type { StatusVariant } from '@/types/common.types';

// ─────────────────────────────────────────
// VARIANTS
// ─────────────────────────────────────────

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900',
  danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900',
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900',
  neutral: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800',
  default: 'bg-muted text-muted-foreground border-border',
};

// ─────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({
  status,
  variant = 'default',
  className,
  dot = true,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      )}
      {status}
    </span>
  );
}

// ─────────────────────────────────────────
// STATUS VARIANT MAPPER
// ─────────────────────────────────────────

const statusVariantMap: Record<string, StatusVariant> = {
  // Success
  ACTIVE: 'success',
  APPROVED: 'success',
  VERIFIED: 'success',
  COMPLETED: 'success',
  CONFIRMED: 'success',
  PAID: 'success',
  RESOLVED: 'success',
  DELIVERED: 'success',
  RECONCILED: 'success',

  // Warning
  PENDING: 'warning',
  PENDING_VERIFICATION: 'warning',
  PENDING_REVIEW: 'warning',
  PENDING_CASH_CONFIRMATION: 'warning',
  IN_REVIEW: 'warning',
  PROCESSING: 'warning',
  SCHEDULED: 'warning',
  MATCHING: 'warning',

  // Danger
  REJECTED: 'danger',
  SUSPENDED: 'danger',
  CANCELLED: 'danger',
  FAILED: 'danger',
  EXPIRED: 'danger',
  DISPUTED: 'danger',
  NO_MATCH: 'danger',
  ABORTED: 'danger',
  DEACTIVATED: 'danger',

  // Info
  IN_PROGRESS: 'info',
  IN_TRANSIT: 'info',
  EN_ROUTE: 'info',
  LIVE: 'info',
  PUBLISHED: 'info',
  AVAILABLE: 'info',

  // Neutral
  INACTIVE: 'neutral',
  OFFLINE: 'neutral',
  DRAFT: 'neutral',
  SKIPPED: 'neutral',
  NOT_REQUESTED: 'neutral',
  UNVERIFIED: 'neutral',
};

export function StatusBadgeAuto({ status, className }: { status: string; className?: string }) {
  const variant = statusVariantMap[status.toUpperCase()] ?? 'default';
  return <StatusBadge status={status} variant={variant} className={className} />;
}