// src/features/journey/hooks/useCreateJourneyTemplate.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { env } from '@/config/env';
import { journeyTemplateApi } from '@/features/journey/api/journeyTemplate.api';
import { journeyTemplateMock } from '@/features/journey/services/journeyTemplate.mock';
import type { CreateJourneyTemplatePayload } from '@/features/journey/types/journeyTemplate.types';

export function useCreateJourneyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateJourneyTemplatePayload) =>
      env.useMockAuth
        ? journeyTemplateMock.create(payload)
        : journeyTemplateApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-templates'] });
    },
  });
}