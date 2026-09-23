// src/app/settings/earnings.tsx

import { EmptyState } from '@/components/feedback/EmptyState';
import { Screen } from '@/components/layout/Screen';

export default function EarningsScreen() {
  return (
    <Screen>
      <EmptyState
        icon="cash-outline"
        title="Earnings & Payouts"
        description="Your earnings and payout history will appear here."
      />
    </Screen>
  );
}