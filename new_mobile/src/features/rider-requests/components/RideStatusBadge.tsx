// src/features/rider-requests/components/RideStatusBadge.tsx

import { Badge } from '@/components/ui/Badge';
import type { RiderRequestStatus } from '@/features/rider-requests/types/riderRequest.types';
import { labelForStatus, phaseFor } from '@/features/rider-requests/utils/ride-state';

type RideStatusBadgeProps = {
  status: RiderRequestStatus;
};

export function RideStatusBadge({ status }: RideStatusBadgeProps) {
  const phase = phaseFor(status);

  const tone =
    phase === 'done' ? 'success' : phase === 'failed' ? 'danger' : 'neutral';

  return <Badge label={labelForStatus(status)} tone={tone} />;
}