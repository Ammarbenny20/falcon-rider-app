
// src/app/(tabs)/earnings.tsx

import { EmptyState } from '@/components/feedback/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { useTranslation } from '@/i18n';

export default function EarningsScreen() {
  const t = useTranslation();

  return (
    <Screen>
      <EmptyState
        icon="cash-outline"
        title={t('earnings.empty')}
        description={t('earnings.empty.description')}
      />
    </Screen>
  );
}