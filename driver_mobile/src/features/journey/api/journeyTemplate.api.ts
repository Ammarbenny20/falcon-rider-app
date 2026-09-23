// src/features/journey/api/journeyTemplate.api.ts

import { apiClient } from '@/services/api/client';
import type {
  CreateJourneyTemplatePayload,
  JourneyTemplate,
} from '@/features/journey/types/journeyTemplate.types';

export const journeyTemplateApi = {
  create: (payload: CreateJourneyTemplatePayload) =>
    apiClient.post<JourneyTemplate>('/journey-templates/', payload),

  list: () =>
    apiClient.get<JourneyTemplate[]>('/journey-templates/'),

  get: (id: string) =>
    apiClient.get<JourneyTemplate>(`/journey-templates/${id}/`),

  remove: (id: string) =>
    apiClient.delete<void>(`/journey-templates/${id}/`),
};