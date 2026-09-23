'use client';

/**
 * Trip 360 Page
 */

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LoadingState } from '@/components/shared/loading-state';
import { ErrorState } from '@/components/shared/error-state';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { Trip360Tabs } from '@/features/operations/components/trip-360-tabs';
import { useTrip } from '@/features/operations/hooks/use-operations';

export default function Trip360Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useTrip(params.id);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Copied to clipboard');
  };

  if (isLoading) return <LoadingState message="Loading trip…" />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Trip not found"
        description="We couldn't load this trip. It may not exist."
        error={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumbs
          items={[
            { label: 'Trips', href: '/operations/trips' },
            { label: data.id },
          ]}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-2xl font-semibold">{data.id}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyId(data.id)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadgeAuto status={data.status} />
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {data.bookingType}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {data.rideAccessType}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={`/people/customers/${data.customerId}`}>
                <Button variant="outline" size="sm">View Customer</Button>
              </Link>
              {data.providerId && (
                <Link href={`/people/providers/${data.providerId}`}>
                  <Button variant="outline" size="sm">View Provider</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-md border bg-muted/30 p-3 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <span className="font-medium">{data.originAddress}</span>
              <span className="text-muted-foreground"> → </span>
              <span className="font-medium">{data.destinationAddress}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Trip360Tabs trip={data} />
    </div>
  );
}