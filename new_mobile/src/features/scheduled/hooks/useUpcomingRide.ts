// src/features/scheduled/hooks/useUpcomingRide.ts

import { useQuery } from '@tanstack/react-query';

import { env } from '@/config/env';
import { riderRequestApi } from '@/features/rider-requests/api/riderRequest.api';
import { riderRequestMock } from '@/features/rider-requests/services/riderRequest.mock';
import type { RiderRequest } from '@/features/rider-requests/types/riderRequest.types';
import type { ScheduledRide } from '@/features/scheduled/types/scheduled.types';

/**
 * Fetch the current user's next scheduled/upcoming ride.
 *
 * Returns:
 *   - null → no upcoming ride
 *   - ScheduledRide → the ride, if any
 *
 * Phase 3: replace mock with real backend filter
 *   (e.g. GET /rider-requests/?status=SCHEDULED&upcoming=true)
 */
export function useUpcomingRide() {
  return useQuery<ScheduledRide | null>({
    queryKey: ['rider-requests', 'upcoming'],
    queryFn: async () => {
      const list: RiderRequest[] = env.useMockAuth
        ? await riderRequestMock.list()
        : (await riderRequestApi.list()).results;

      // Filter: scheduled, not cancelled, not fulfilled, not expired
      const scheduled = list.find((r) => {
        if (!r.is_scheduled) return false;
        if (r.status === 'CANCELLED') return false;
        if (r.status === 'FULFILLED') return false;
        if (r.status === 'EXPIRED') return false;
        return true;
      });

      return scheduled ?? null;
    },
    staleTime: 30_000,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      // Poll every 30 seconds while a scheduled ride is pending
      if (
        data.status === 'SCHEDULED' ||
        data.status === 'AWAITING_CONFIRMATION' ||
        data.status === 'CONFIRMED'
      ) {
        return 30_000;
      }
      return false;
    },
  });
}