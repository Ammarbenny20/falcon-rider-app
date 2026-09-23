'use client';

/**
 * Incident Detail Page
 */

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LoadingState } from '@/components/shared/loading-state';
import { ErrorState } from '@/components/shared/error-state';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { InfoRow } from '@/features/shared/components/info-row';
import { Timeline, type TimelineEvent } from '@/features/shared/components/timeline';
import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/format';
import { safetyApi } from '@/features/safety/api/safety.api';
import type { SafetyIncident } from '@/features/safety/types/safety.types';

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: 'text-red-700 dark:text-red-400',
  HIGH: 'text-orange-700 dark:text-orange-400',
  MEDIUM: 'text-amber-700 dark:text-amber-400',
  LOW: 'text-muted-foreground',
};

export default function IncidentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['safety', 'incident', params.id],
    queryFn: async () => {
      const res = await safetyApi.listIncidents({ page: 1, pageSize: 100 });
      const incident = res.results.find(
        (i: SafetyIncident) => i.id === params.id
      );
      if (!incident) throw new Error('Incident not found');
      return incident;
    },
  });

  if (isLoading) return <LoadingState message="Loading incident…" />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Incident not found"
        description="We couldn't load this incident."
        error={error}
        onRetry={refetch}
      />
    );
  }

  const events: TimelineEvent[] = [
    {
      id: 'reported',
      title: 'Incident reported',
      description: `Reported by ${data.reportedByName ?? 'system'}`,
      timestamp: data.createdAt,
      severity: 'danger',
    },
    ...(data.assignedTo
      ? [
          {
            id: 'assigned',
            title: 'Assigned to operator',
            description: data.assignedTo,
            timestamp: data.updatedAt,
            severity: 'info' as const,
          },
        ]
      : []),
    ...(data.resolvedAt
      ? [
          {
            id: 'resolved',
            title: 'Incident resolved',
            description: data.resolution,
            timestamp: data.resolvedAt,
            severity: 'success' as const,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumbs
          items={[
            { label: 'Incidents', href: '/safety/incidents' },
            { label: data.id },
          ]}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <h1 className="font-mono text-2xl font-semibold">{data.id}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadgeAuto status={data.status} />
                <span
                  className={cn(
                    'text-xs font-semibold',
                    SEVERITY_COLORS[data.severity]
                  )}
                >
                  {data.severity}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {data.type}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.tripId && (
                <Link href={`/operations/trips/${data.tripId}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Trip
                  </Button>
                </Link>
              )}
              {data.customerId && (
                <Link href={`/people/customers/${data.customerId}`}>
                  <Button variant="outline" size="sm">
                    View Customer
                  </Button>
                </Link>
              )}
              {data.providerId && (
                <Link href={`/people/providers/${data.providerId}`}>
                  <Button variant="outline" size="sm">
                    View Provider
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">{data.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{data.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parties Involved</CardTitle>
          </CardHeader>
          <CardContent>
            {data.customerName && <InfoRow label="Customer" value={data.customerName} />}
            {data.providerName && <InfoRow label="Provider" value={data.providerName} />}
            {data.reportedByName && (
              <InfoRow label="Reported By" value={data.reportedByName} />
            )}
            {data.assignedTo && <InfoRow label="Assigned To" value={data.assignedTo} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timing</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Reported" value={formatDateTime(data.createdAt)} />
            <InfoRow label="Updated" value={formatDateTime(data.updatedAt)} />
            {data.resolvedAt && (
              <InfoRow label="Resolved" value={formatDateTime(data.resolvedAt)} />
            )}
          </CardContent>
        </Card>

        {data.location && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow
                label="Address"
                value={data.location.address ?? '—'}
              />
              <InfoRow
                label="Coordinates"
                value={`${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}`}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline events={events} />
        </CardContent>
      </Card>

      {data.resolution && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{data.resolution}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}