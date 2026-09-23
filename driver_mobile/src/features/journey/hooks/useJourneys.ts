// src/features/journey/hooks/useJourneys.ts

import { useQuery } from '@tanstack/react-query';

import { env } from '@/config/env';
import { journeyApi } from '@/features/journey/api/journey.api';
import { journeyMock } from '@/features/journey/services/journey.mock';
import type { Journey } from '@/features/journey/types/journey.types';

export function useJourneys() {
  return useQuery<Journey[]>({
    queryKey: ['journeys'],
    queryFn: async () =>
      env.useMockAuth ? journeyMock.list() : journeyApi.list(),
    staleTime: 30_000,
  });
}