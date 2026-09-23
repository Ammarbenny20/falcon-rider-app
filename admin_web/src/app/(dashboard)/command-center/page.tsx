'use client';

/**
 * Falcon Rider Admin Portal — Command Center
 *
 * The operational heart of the marketplace.
 * Answers: What's happening? What needs attention? What's the state?
 */

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { LiveOperationsStrip } from '@/features/dashboard/components/live-operations-strip';
import { OperationsMap } from '@/features/dashboard/components/operations-map';
import { ActionCenterPanel } from '@/features/dashboard/components/action-center-panel';
import { KeyMetricsRow } from '@/features/dashboard/components/key-metrics-row';
import { ActivityFeed } from '@/features/dashboard/components/activity-feed';
import { useCommandCenter } from '@/features/dashboard/hooks/use-dashboard';
import { formatTime } from '@/lib/utils/format';

export default function CommandCenterPage() {
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useCommandCenter();
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(new Date(dataUpdatedAt).toISOString());
    }
  }, [dataUpdatedAt]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        description="Real-time operational overview of the Falcon Rider marketplace"
        actions={
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Updated {formatTime(lastUpdated)}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Live Operations Strip */}
      <LiveOperationsStrip
        data={data?.liveOperations}
        isLoading={isLoading}
      />

      {/* Map + Action Center */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OperationsMap data={data?.mapData} isLoading={isLoading} />
        </div>
        <div>
          <ActionCenterPanel
            items={data?.actionItems}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Marketplace State
        </h2>
        <KeyMetricsRow metrics={data?.keyMetrics} isLoading={isLoading} />
      </div>

      {/* Activity Feed */}
      <ActivityFeed events={data?.activityFeed} isLoading={isLoading} />

      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load some Command Center data. Some sections may be stale.
        </div>
      )}
    </div>
  );
}