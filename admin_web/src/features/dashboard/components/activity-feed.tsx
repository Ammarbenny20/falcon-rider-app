'use client';

/**
 * Activity Feed — recent operational events.
 */

import Link from 'next/link';
import {
  Activity, CheckCircle2, AlertTriangle, ShieldAlert, DollarSign,
  UserCheck, Navigation, MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import type { ActivityEvent, ActivityEventType } from '../types/dashboard.types';

interface Props {
  events?: ActivityEvent[];
  isLoading?: boolean;
}

const EVENT_ICON: Record<ActivityEventType, React.ComponentType<{ className?: string }>> = {
  TRIP_STARTED: Navigation,
  TRIP_COMPLETED: CheckCircle2,
  REQUEST_CREATED: Activity,
  PROVIDER_MATCHED: UserCheck,
  PROVIDER_VERIFIED: UserCheck,
  PAYMENT_COMPLETED: DollarSign,
  SAFETY_INCIDENT: ShieldAlert,
  JOURNEY_PUBLISHED: MapPin,
  REFUND_APPROVED: CheckCircle2,
};

const SEVERITY_STYLES: Record<NonNullable<ActivityEvent['severity']>, string> = {
  info: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
  success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
  warning: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  danger: 'text-red-600 bg-red-50 dark:bg-red-950/40',
};

export function ActivityFeed({ events, isLoading }: Props) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading || !events ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState title="No recent activity" />
        ) : (
          <ul className="divide-y">
            {events.map((event) => (
              <ActivityRow key={event.id} event={event} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const Icon = EVENT_ICON[event.type];
  const severity = event.severity ?? 'info';

  return (
    <li className="flex items-start gap-3 p-3 transition-colors hover:bg-muted/30">
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          SEVERITY_STYLES[severity]
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{event.title}</p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatRelativeTime(event.timestamp)}
          </span>
        </div>
        {event.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {event.description}
          </p>
        )}
      </div>
    </li>
  );
}