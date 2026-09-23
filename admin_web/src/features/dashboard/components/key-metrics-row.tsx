'use client';

/**
 * Key Metrics Row — marketplace state.
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';
import { cn } from '@/lib/utils/cn';
import type { KeyMetric } from '../types/dashboard.types';

interface Props {
  metrics?: KeyMetric[];
  isLoading?: boolean;
}

export function KeyMetricsRow({ metrics, isLoading }: Props) {
  if (isLoading || !metrics) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-7 w-20" />
              <Skeleton className="mt-2 h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}

function MetricCard({ metric }: { metric: KeyMetric }) {
  const change = metric.change;
  const isPositive = change?.isPositive ?? true;
  const TrendIcon =
    !change || change.direction === 'flat'
      ? Minus
      : change.direction === 'up'
        ? TrendingUp
        : TrendingDown;

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {metric.label}
        </div>
        <div className="mt-2 text-2xl font-semibold tabular-nums">
          {metric.formattedValue}
        </div>
        {change && (
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            <TrendIcon
              className={cn(
                'h-3.5 w-3.5',
                isPositive ? 'text-emerald-600' : 'text-red-600'
              )}
            />
            <span
              className={cn(
                'font-medium',
                isPositive ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {change.value > 0 ? '+' : ''}
              {change.value}%
            </span>
            {metric.comparisonLabel && (
              <span className="text-muted-foreground">{metric.comparisonLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}