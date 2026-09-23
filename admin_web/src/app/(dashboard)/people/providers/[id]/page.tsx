'use client';

/**
 * Falcon Rider Admin Portal — Provider 360 Page
 */

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { LoadingState } from '@/components/shared/loading-state';
import { ErrorState } from '@/components/shared/error-state';
import { Provider360Header } from '@/features/providers/components/provider-360-header';
import { Provider360Tabs } from '@/features/providers/components/provider-360-tabs';
import { useProvider } from '@/features/providers/hooks/use-providers';

export default function Provider360Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useProvider(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState message="Loading provider…" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Provider not found"
          description="We couldn't load this provider. It may not exist."
          error={error}
          onRetry={refetch}
        />
      </div>
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
            { label: 'Providers', href: '/people/providers' },
            { label: data.fullName },
          ]}
        />
      </div>

      <Provider360Header provider={data} />
      <Provider360Tabs provider={data} />
    </div>
  );
}