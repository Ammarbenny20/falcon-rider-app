// src/features/auth/api/auth.api.ts

import { apiClient } from '@/services/api/client';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/features/auth/types/auth.types';

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register/', payload, {
      skipAuth: true,
    }),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login/', payload, {
      skipAuth: true,
    }),

  logout: () =>
    apiClient.post<{ detail: string }>('/auth/logout/'),

  getMe: () =>
    apiClient.get<User>('/auth/me/'),

  updateMe: (payload: Partial<Pick<User, 'full_name' | 'email'>>) =>
    apiClient.patch<User>('/auth/me/', payload),
};