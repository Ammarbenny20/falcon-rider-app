'use client';

/**
 * Receipt Detail Page
 */

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LoadingState } from '@/components/shared/loading-state';
import { ErrorState } from '@/components/shared/error-state';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { InfoRow } from '@/features/shared/components/info-row';
import { useReceipt } from '@/features/finance/hooks/use-finance';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';

export default function ReceiptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useReceipt(params.id);

  if (isLoading) return <LoadingState message="Loading receipt…" />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Receipt not found"
        description="We couldn't load this receipt."
        error={error}
        onRetry={refetch}
      />
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumbs
          items={[
            { label: 'Receipts', href: '/money/receipts' },
            { label: data.id },
          ]}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-mono text-2xl font-semibold">{data.id}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadgeAuto status={data.paymentStatus} />
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {data.method}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
              {data.tripId && (
                <Link href={`/operations/trips/${data.tripId}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Trip
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Route</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Origin" value={data.origin} />
            <InfoRow label="Destination" value={data.destination} />
            {data.distanceKm !== undefined && (
              <InfoRow label="Distance" value={`${data.distanceKm} km`} />
            )}
            {data.departedAt && (
              <InfoRow label="Departed" value={formatDateTime(data.departedAt)} />
            )}
            {data.arrivedAt && (
              <InfoRow label="Arrived" value={formatDateTime(data.arrivedAt)} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow
              label="Fare"
              value={formatCurrency(data.fare.amount, data.fare.currency)}
            />
            <InfoRow label="Method" value={data.method} />
            <InfoRow label="Status" value={<StatusBadgeAuto status={data.paymentStatus} />} />
            <InfoRow label="Generated" value={formatDateTime(data.generatedAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Name" value={data.customerName} />
            <InfoRow label="ID" value={<span className="font-mono text-xs">{data.customerId}</span>} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Provider</CardTitle>
          </CardHeader>
          <CardContent>
            {data.providerName ? (
              <>
                <InfoRow label="Name" value={data.providerName} />
                <InfoRow label="ID" value={<span className="font-mono text-xs">{data.providerId}</span>} />
                {data.vehiclePlate && (
                  <InfoRow label="Vehicle" value={<span className="font-mono text-xs">{data.vehiclePlate}</span>} />
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No provider</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}