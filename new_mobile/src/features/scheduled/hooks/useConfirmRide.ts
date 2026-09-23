// src/features/scheduled/hooks/useConfirmRide.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { env } from '@/config/env';
import { riderRequestApi } from '@/features/rider-requests/api/riderRequest.api';
import { riderRequestMock } from '@/features/rider-requests/services/riderRequest.mock';

/**
 * Confirm a scheduled ride before departure.
 *
 * Phase 3: real backend endpoint (e.g. POST /rider-requests/{id}/confirm/)
 * For now: mock by re-fetching the request (status stays as-is).
 */
export function useConfirmRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Phase 3: replace with riderRequestApi.confirm(id)
      if (env.useMockAuth) {
        return riderRequestMock.get(id);
      }
      return riderRequestApi.get(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['rider-requests', id] });
      queryClient.invalidateQueries({ queryKey: ['rider-requests', 'upcoming'] });
    },
  });
}