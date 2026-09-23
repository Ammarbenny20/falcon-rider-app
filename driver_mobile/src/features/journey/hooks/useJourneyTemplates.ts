// src/features/journey/hooks/useJourneyTemplates.ts

import { useQuery } from '@tanstack/react-query';

import { env } from '@/config/env';
import { journeyTemplateApi } from '@/features/journey/api/journeyTemplate.api';
import { journeyTemplateMock } from '@/features/journey/services/journeyTemplate.mock';
import type { JourneyTemplate } from '@/features/journey/types/journeyTemplate.types';

export function useJourneyTemplates() {
  return useQuery<JourneyTemplate[]>({
    queryKey: ['journey-templates'],
    queryFn: async () =>
      env.useMockAuth
        ? journeyTemplateMock.list()
        : journeyTemplateApi.list(),
    staleTime: 30_000,
  });
}