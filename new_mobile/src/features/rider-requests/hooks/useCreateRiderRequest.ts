// src/features/rider-requests/hooks/useCreateRiderRequest.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { env } from '@/config/env';
import { riderRequestApi } from '@/features/rider-requests/api/riderRequest.api';
import { riderRequestMock } from '@/features/rider-requests/services/riderRequest.mock';
import type { CreateRiderRequestPayload } from '@/features/rider-requests/types/riderRequest.types';

export function useCreateRiderRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRiderRequestPayload) => {
      if (env.useMockAuth) {
        return riderRequestMock.create(payload);
      }
      return riderRequestApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rider-requests'] });
    },
  });
}