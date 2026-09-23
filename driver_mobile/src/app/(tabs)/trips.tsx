// src/app/(tabs)/trips.tsx

import { EmptyState } from '@/components/feedback/EmptyState';
import { Screen } from '@/components/layout/Screen';
import { useTranslation } from '@/i18n';

export default function TripsScreen() {
  const t = useTranslation();

  return (
    <Screen>
      <EmptyState
        icon="list-outline"
        title={t('trips.empty')}
        description={t('trips.empty.description')}
      />
    </Screen>
  );
}