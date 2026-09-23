/**
 * Falcon Rider Admin Portal — Timeline Component
 *
 * Chronological event display for entities.
 */

import {
  CheckCircle2, Clock, AlertCircle, Info, XCircle, Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDateTime, formatRelativeTime } from '@/lib/utils/format';

export type TimelineSeverity = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
  severity?: TimelineSeverity;
}

const SEVERITY_STYLES: Record<TimelineSeverity, string> = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  neutral: 'bg-muted text-muted-foreground',
};

const SEVERITY_ICONS: Record<TimelineSeverity, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
  danger: XCircle,
  neutral: Circle,
};

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-md border border-dashed py-12 text-center text-sm text-muted-foreground">
        No events yet
      </div>
    );
  }

  return (
    <ol className={cn('relative space-y-4', className)}>
      {events.map((event, index) => {
        const severity = event.severity ?? 'info';
        const Icon = SEVERITY_ICONS[severity];
        const isLast = index === events.length - 1;

        return (
          <li key={event.id} className="relative flex gap-3">
            {/* Line */}
            {!isLast && (
              <span
                className="absolute left-4 top-8 h-full w-px bg-border"
                aria-hidden
              />
            )}

            {/* Icon */}
            <div
              className={cn(
                'z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                SEVERITY_STYLES[severity]
              )}
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-medium leading-tight">{event.title}</p>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>
              {event.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
              )}
              <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span>{formatDateTime(event.timestamp)}</span>
                {event.actor && <span>by {event.actor}</span>}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}