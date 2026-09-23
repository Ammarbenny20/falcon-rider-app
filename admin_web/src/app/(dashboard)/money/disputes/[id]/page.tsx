'use client';

/**
 * Dispute Detail Page
 */

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LoadingState } from '@/components/shared/loading-state';
import { ErrorState } from '@/components/shared/error-state';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { InfoRow } from '@/features/shared/components/info-row';
import { Timeline, type TimelineEvent } from '@/features/shared/components/timeline';
import { financeApi } from '@/features/finance/api/finance.api';
import type { Dispute } from '@/features/finance/types/finance.types';
import {
  formatCurrency,
  formatDateTime,
  humanizeStatus,
} from '@/lib/utils/format';

export default function DisputeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['disputes', 'detail', params.id],
    queryFn: async () => {
      const res = await financeApi.listDisputes({ page: 1, pageSize: 100 });
      const dispute = res.results.find((d: Dispute) => d.id === params.id);
      if (!dispute) throw new Error('Dispute not found');
      return dispute;
    },
  });

  if (isLoading) return <LoadingState message="Loading dispute…" />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Dispute not found"
        description="We couldn't load this dispute."
        error={error}
        onRetry={refetch}
      />
    );
  }

  const events: TimelineEvent[] = [
    {
      id: 'created',
      title: 'Dispute created',
      description: `Category: ${humanizeStatus(data.category)}`,
      timestamp: data.createdAt,
      severity: 'warning',
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
    ...(data.status === 'RESOLVED' || data.status === 'CLOSED'
      ? [
          {
            id: 'resolved',
            title: `Dispute ${data.status.toLowerCase()}`,
            description: data.resolution,
            timestamp: data.resolvedAt ?? data.updatedAt,
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
            { label: 'Disputes', href: '/money/disputes' },
            { label: data.id },
          ]}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h1 className="font-mono text-2xl font-semibold">{data.id}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadgeAuto status={data.status} />
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {humanizeStatus(data.category)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.paymentId && (
                <Link href={`/money/payments/${data.paymentId}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Payment
                  </Button>
                </Link>
              )}
              {data.tripId && (
                <Link href={`/operations/trips/${data.tripId}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Trip
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <p className="mt-6 text-sm">{data.description}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Customer" value={data.customerName} />
            <InfoRow label="Category" value={humanizeStatus(data.category)} />
            {data.amount && (
              <InfoRow
                label="Amount"
                value={formatCurrency(data.amount.amount, data.amount.currency)}
              />
            )}
            <InfoRow label="Created" value={formatDateTime(data.createdAt)} />
            <InfoRow label="Updated" value={formatDateTime(data.updatedAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Status" value={<StatusBadgeAuto status={data.status} />} />
            <InfoRow label="Assigned To" value={data.assignedTo ?? 'Unassigned'} />
            {data.resolvedAt && (
              <InfoRow label="Resolved" value={formatDateTime(data.resolvedAt)} />
            )}
          </CardContent>
        </Card>
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