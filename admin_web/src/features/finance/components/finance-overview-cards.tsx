'use client';

/**
 * Finance Overview Cards — top-level finance stats.
 */

import {
  DollarSign, Receipt, RotateCcw, AlertCircle, Wallet, TrendingDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import type { FinanceOverview } from '../types/finance.types';

export function FinanceOverviewCards({
  data,
  isLoading,
}: {
  data?: FinanceOverview;
  isLoading?: boolean;
}) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="mt-3 h-6 w-24" />
              <Skeleton className="mt-1 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      icon: DollarSign,
      label: 'Revenue Today',
      value: formatCurrency(data.totalRevenueToday.amount, data.totalRevenueToday.currency),
      accent: 'text-emerald-600',
    },
    {
      icon: DollarSign,
      label: 'Revenue (Period)',
      value: formatCurrency(data.totalRevenuePeriod.amount, data.totalRevenuePeriod.currency),
      accent: 'text-emerald-700',
    },
    {
      icon: RotateCcw,
      label: 'Pending Refunds',
      value: formatNumber(data.pendingRefunds),
      accent: 'text-amber-600',
    },
    {
      icon: Wallet,
      label: 'Pending Payouts',
      value: formatNumber(data.pendingPayouts),
      accent: 'text-blue-600',
    },
    {
      icon: AlertCircle,
      label: 'Open Disputes',
      value: formatNumber(data.openDisputes),
      accent: 'text-red-600',
    },
    {
      icon: TrendingDown,
      label: 'Recon Exceptions',
      value: formatNumber(data.reconciliationExceptions),
      accent: 'text-orange-600',
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="pt-5">
            <c.icon className={`h-5 w-5 ${c.accent}`} />
            <div className="mt-2 text-xl font-semibold tabular-nums">{c.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{c.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}