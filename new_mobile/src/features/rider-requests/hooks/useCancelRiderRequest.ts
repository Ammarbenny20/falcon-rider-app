// src/features/rider-requests/hooks/useCancelRiderRequest.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { env } from '@/config/env';
import { riderRequestApi } from '@/features/rider-requests/api/riderRequest.api';
import { riderRequestMock } from '@/features/rider-requests/services/riderRequest.mock';

export function useCancelRiderRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      if (env.useMockAuth) return riderRequestMock.cancel(id);
      return riderRequestApi.cancel(id, reason);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rider-requests', variables.id],
      });
    },
  });
}