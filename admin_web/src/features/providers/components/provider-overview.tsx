'use client';

/**
 * Falcon Rider Admin Portal — Provider Overview Tab
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import type { Provider360 } from '../types/provider.types';

export function ProviderOverview({ provider }: { provider: Provider360 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Trips"
        value={formatNumber(provider.totalTrips ?? 0)}
      />
      <StatCard
        label="Total Journeys"
        value={formatNumber(provider.totalJourneys ?? 0)}
      />
      <StatCard
        label="Rating"
        value={provider.rating ? provider.rating.toFixed(2) : '—'}
      />
      <StatCard
        label="Earned (period)"
        value={
          provider.earnings
            ? formatCurrency(
                provider.earnings.totalEarned,
                provider.earnings.currency
              )
            : '—'
        }
      />

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Operational Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Account status" value={provider.accountStatus} />
          <Row
            label="Professional capability"
            value={provider.professionalCapability}
          />
          <Row
            label="Community capability"
            value={provider.communityCapability}
          />
          <Row
            label="Professional availability"
            value={provider.professionalAvailability}
          />
          <Row
            label="Identity verification"
            value={provider.identityVerification}
          />
          <Row label="Phone verification" value={provider.phoneVerification} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value.replace(/_/g, ' ')}</span>
    </div>
  );
}