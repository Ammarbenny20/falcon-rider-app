// src/features/journey/api/journey.api.ts

import { apiClient } from '@/services/api/client';
import type {
  CreateJourneyPayload,
  Journey,
} from '@/features/journey/types/journey.types';

export const journeyApi = {
  create: (payload: CreateJourneyPayload) =>
    apiClient.post<Journey>('/journeys/', payload),

  list: () => apiClient.get<Journey[]>('/journeys/'),

  get: (id: string) => apiClient.get<Journey>(`/journeys/${id}/`),

  cancel: (id: string) =>
    apiClient.post<Journey>(`/journeys/${id}/cancel/`),
};