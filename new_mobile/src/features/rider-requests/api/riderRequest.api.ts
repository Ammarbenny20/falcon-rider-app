// src/features/rider-requests/api/riderRequest.api.ts

import { apiClient } from '@/services/api/client';
import type {
  CreateRiderRequestPayload,
  PaginatedResponse,
  RiderRequest,
} from '@/features/rider-requests/types/riderRequest.types';

export const riderRequestApi = {
  create: (payload: CreateRiderRequestPayload) =>
    apiClient.post<RiderRequest>('/rider-requests/', payload),

  list: () =>
    apiClient.get<PaginatedResponse<RiderRequest>>('/rider-requests/'),

  get: (id: string) =>
    apiClient.get<RiderRequest>(`/rider-requests/${id}/`),

  cancel: (id: string, reason?: string) =>
    apiClient.post<RiderRequest>(`/rider-requests/${id}/cancel/`, {
      reason: reason ?? '',
    }),
};