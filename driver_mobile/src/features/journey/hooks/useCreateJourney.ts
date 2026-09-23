// src/features/journey/hooks/useCreateJourney.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { env } from '@/config/env';
import { journeyApi } from '@/features/journey/api/journey.api';
import { journeyMock } from '@/features/journey/services/journey.mock';
import type { CreateJourneyPayload } from '@/features/journey/types/journey.types';

export function useCreateJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateJourneyPayload) =>
      env.useMockAuth
        ? journeyMock.create(payload)
        : journeyApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
    },
  });
}