// src/features/routes/api/routes.api.ts

import { apiClient } from '@/services/api/client';
import type {
  DirectionsRequest,
  DirectionsResponse,
  GeocodeResponse,
} from '@/features/routes/types/routes.types';

export const routesApi = {
  geocode: (query: string) =>
    apiClient.get<GeocodeResponse>(
      `/routes/geocode/?q=${encodeURIComponent(query)}`,
    ),

  directions: (payload: DirectionsRequest) =>
    apiClient.post<DirectionsResponse>('/routes/directions/', payload),
};