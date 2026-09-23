'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';
import { LineChart, PieChart } from '@/components/charts';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/format';
import { useMarketplaceMetrics, useFinanceMetrics } from '@/features/analytics/hooks/use-analytics';

export default function MarketplaceInsightsPage() {
  const { data, isLoading } = useMarketplaceMetrics();
  const { data: finance, isLoading: financeLoading } = useFinanceMetrics();

  const cards = data
    ? [
        { label: 'Requests', value: formatNumber(data.requests) },
        { label: 'Matches', value: formatNumber(data.matches) },
        { label: 'Match Rate', value: formatPercentage(data.matchRate) },
        { label: 'Cancellation Rate', value: formatPercentage(data.cancellationRate) },
        { label: 'Completion Rate', value: formatPercentage(data.completionRate) },
        { label: 'Trips', value: formatNumber(data.trips) },
        { label: 'GMV', value: formatCurrency(data.gmv.amount, data.gmv.currency) },
        { label: 'Revenue', value: formatCurrency(data.revenue.amount, data.revenue.currency) },
      ]
    : [];

  const revenueData =
    finance?.revenueByDay.map((d) => ({
      date: d.date,
      revenue: d.amount,
    })) ?? [];

  const paymentMethodsData =
    finance?.paymentsByMethod.map((m) => ({
      name: m.method,
      value: m.count,
    })) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace Insights"
        description="Marketplace performance for the selected period"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-3 h-7 w-28" />
                </CardContent>
              </Card>
            ))
          : cards.map((c) => (
              <Card key={c.label}>
                <CardContent className="pt-5">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold tabular-nums">{c.value}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChart
            title="Revenue (last 14 days)"
            description="Daily revenue trend"
            data={revenueData}
            xKey="date"
            lines={[{ key: 'revenue', label: 'Revenue' }]}
            isLoading={financeLoading}
            formatter={(v) => formatCurrency(v, 'TZS')}
          />
        </div>
        <div>
          <PieChart
            title="Payments by Method"
            description="Distribution of payment methods"
            data={paymentMethodsData}
            isLoading={financeLoading}
            formatter={(v) => formatNumber(v)}
          />
        </div>
      </div>
    </div>
  );
}