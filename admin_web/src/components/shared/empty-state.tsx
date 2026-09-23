/**
 * Falcon Rider Admin Portal — Empty States
 *
 * Consistent empty state UI across the admin portal.
 */

import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────

export function NoDataEmpty({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="No data available"
      description="There's nothing to display here yet."
      action={onRefresh ? { label: 'Refresh', onClick: onRefresh } : undefined}
    />
  );
}

export function NoResultsEmpty({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your search or filters."
      action={onClear ? { label: 'Clear filters', onClick: onClear } : undefined}
    />
  );
}