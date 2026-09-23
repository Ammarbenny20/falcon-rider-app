'use client';

/**
 * Money Overview Page — landing for finance.
 */

import Link from 'next/link';
import {
  CreditCard, RotateCcw, Wallet, Receipt, AlertCircle, BarChart3,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { FinanceOverviewCards } from '@/features/finance/components/finance-overview-cards';
import { useFinanceOverview } from '@/features/finance/hooks/use-finance';

const SECTIONS = [
  { href: '/money/payments', label: 'Payments', icon: CreditCard, description: 'All payments, refund actions, payment events' },
  { href: '/money/refunds', label: 'Refunds', icon: RotateCcw, description: 'Refund workflow — request, review, approve' },
  { href: '/money/payouts', label: 'Payouts', icon: Wallet, description: 'Provider payouts, approve, retry' },
  { href: '/money/receipts', label: 'Receipts', icon: Receipt, description: 'Backend receipts for every completed trip' },
  { href: '/money/disputes', label: 'Disputes', icon: AlertCircle, description: 'Customer disputes, investigate, resolve' },
  { href: '/money/reconciliation', label: 'Reconciliation', icon: BarChart3, description: 'Fare vs payment vs earning integrity' },
];

export default function MoneyOverviewPage() {
  const { data, isLoading } = useFinanceOverview();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Money"
        description="Financial operations workspace — payments, refunds, payouts, receipts, disputes, reconciliation"
      />

      <FinanceOverviewCards data={data} isLoading={isLoading} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="block">
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardContent className="pt-6">
                <s.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 text-base font-semibold">{s.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}