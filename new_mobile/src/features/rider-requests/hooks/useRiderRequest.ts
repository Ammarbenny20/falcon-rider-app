// src/features/rider-requests/hooks/useRiderRequest.ts

import { useQuery } from '@tanstack/react-query';

import { env } from '@/config/env';
import { riderRequestApi } from '@/features/rider-requests/api/riderRequest.api';
import { riderRequestMock } from '@/features/rider-requests/services/riderRequest.mock';

export function useRiderRequest(id: string | undefined) {
  return useQuery({
    queryKey: ['rider-requests', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing request id');
      if (env.useMockAuth) return riderRequestMock.get(id);
      return riderRequestApi.get(id);
    },
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'SUBMITTED' || status === 'MATCHING') return 3000;
      return false;
    },
  });
}