/**
 * Falcon Rider Admin Portal â€” Auth API
 *
 * API calls for authentication.
 * Endpoints are marked [VERIFY] until confirmed with backend.
 */

import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { LoginCredentials, LoginResponse, AdminUser } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  me: async (): Promise<AdminUser> => {
    const { data } = await apiClient.get(ENDPOINTS.AUTH.ME);
    return data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.REFRESH, {
      refresh: refreshToken,
    });
    return data;
  },
};

