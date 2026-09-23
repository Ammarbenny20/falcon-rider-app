// src/features/scheduled/hooks/useRescheduleRide.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { env } from '@/config/env';
import { riderRequestApi } from '@/features/rider-requests/api/riderRequest.api';
import { riderRequestMock } from '@/features/rider-requests/services/riderRequest.mock';

type ReschedulePayload = {
  id: string;
  scheduledFor: string; // ISO timestamp
};

/**
 * Reschedule a scheduled ride to a new date/time.
 *
 * Phase 3: real backend endpoint
 *   (e.g. PATCH /rider-requests/{id}/ with { scheduled_for })
 * For now: mock by re-fetching the request.
 */
export function useRescheduleRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: ReschedulePayload) => {
      // Phase 3: replace with riderRequestApi.reschedule(id, scheduledFor)
      if (env.useMockAuth) {
        return riderRequestMock.get(id);
      }
      return riderRequestApi.get(id);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['rider-requests', id] });
      queryClient.invalidateQueries({ queryKey: ['rider-requests', 'upcoming'] });
    },
  });
}