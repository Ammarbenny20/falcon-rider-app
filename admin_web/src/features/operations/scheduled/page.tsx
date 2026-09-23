'use client';

import Link from 'next/link';
import { AlertTriangle, Clock, ShieldAlert, CreditCard, Users, Bell, Bike } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/format';
import { useScheduled } from '@/features/operations/hooks/use-operations';
import type { RiskLevel, RiskReason } from '@/features/operations/types/operations.types';

const RISK_STYLES: Record<RiskLevel, string> = {
  HIGH: 'border-l-red-500 bg-red-50/60 dark:bg-red-950/20',
  MEDIUM: 'border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/20',
  LOW: 'border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
};

const RISK_LABEL: Record<RiskLevel, string> = {
  HIGH: 'text-red-700 dark:text-red-400',
  MEDIUM: 'text-amber-700 dark:text-amber-400',
  LOW: 'text-emerald-700 dark:text-emerald-400',
};

const RISK_ICON: Record<RiskReason, React.ComponentType<{ className?: string }>> = {
  PROVIDER_NOT_ASSIGNED: Users,
  PROVIDER_NOT_AVAILABLE: Users,
  VERIFICATION_PROBLEM: ShieldAlert,
  PAYMENT_PROBLEM: CreditCard,
  CUSTOMER_CANCELLATION: AlertTriangle,
  CAPACITY_PROBLEM: Bike,
  NOTIFICATION_FAILURE: Bell,
};

export default function ScheduledPage() {
  const { data, isLoading } = useScheduled();

  const buckets = data
    ? {
        next15: data.filter((t) => t.minutesUntil <= 15),
        next30: data.filter((t) => t.minutesUntil > 15 && t.minutesUntil <= 30),
        next60: data.filter((t) => t.minutesUntil > 30 && t.minutesUntil <= 60),
        later: data.filter((t) => t.minutesUntil > 60),
      }
    : { next15: [], next30: [], next60: [], later: [] };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scheduled Trips"
        description="Risk windows — trips approaching departure, auto-refreshing every 30 seconds"
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-24 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Bucket title="Next 15 minutes" subtitle="Critical — immediate action" items={buckets.next15} tone="critical" />
          <Bucket title="Next 30 minutes" subtitle="High attention" items={buckets.next30} tone="high" />
          <Bucket title="Next 60 minutes" subtitle="Monitor" items={buckets.next60} tone="medium" />
          <Bucket title="Later today" subtitle="No immediate action" items={buckets.later} tone="low" />
        </div>
      )}
    </div>
  );
}

function Bucket({
  title,
  subtitle,
  items,
  tone,
}: {
  title: string;
  subtitle: string;
  items: import('@/features/operations/types/operations.types').ScheduledTrip[];
  tone: 'critical' | 'high' | 'medium' | 'low';
}) {
  const toneHeader: Record<string, string> = {
    critical: 'text-red-700 dark:text-red-400',
    high: 'text-amber-700 dark:text-amber-400',
    medium: 'text-blue-700 dark:text-blue-400',
    low: 'text-muted-foreground',
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className={cn('h-4 w-4', toneHeader[tone])} />
              {title}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {items.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {items.length === 0 ? (
          <EmptyState title="No trips" description="Nothing scheduled in this window." />
        ) : (
          <div className="space-y-2">
            {items.map((trip) => (
              <Link key={trip.id} href={`/operations/trips/${trip.tripId}`} className="block">
                <div
                  className={cn(
                    'rounded-md border border-l-4 p-3 transition-colors hover:bg-muted/30',
                    RISK_STYLES[trip.riskLevel]
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium">{trip.tripId}</span>
                        <span className={cn('text-[10px] font-semibold uppercase', RISK_LABEL[trip.riskLevel])}>
                          {trip.riskLevel}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-medium">{trip.customerName}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {trip.originAddress} → {trip.destinationAddress}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDateTime(trip.scheduledFor)}</span>
                        <span className="font-medium text-foreground">{trip.minutesUntil} min</span>
                      </div>
                      {trip.riskReasons.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {trip.riskReasons.map((reason) => {
                            const Icon = RISK_ICON[reason];
                            return (
                              <span key={reason} className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-[10px] font-medium">
                                <Icon className="h-3 w-3" />
                                {reason.replace(/_/g, ' ')}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {trip.providerAssigned && trip.providerName && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Provider: {trip.providerName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}