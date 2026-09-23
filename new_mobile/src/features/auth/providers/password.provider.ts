// src/features/auth/providers/password.provider.ts

import { authApi } from '@/features/auth/api/auth.api';
import { authMock } from '@/features/auth/services/auth.mock';
import { env } from '@/config/env';
import type { AuthProvider } from '@/features/auth/providers/types';
import type {
  LoginPayload,
  RegisterPayload,
} from '@/features/auth/types/auth.types';
import type { SessionCredentials } from '@/features/auth/types/session.types';

/**
 * Password authentication provider.
 *
 * When env.useMockAuth is true, calls are served locally so the frontend
 * can be demonstrated without a running backend.
 */
export const passwordProvider = {
  async login(payload: LoginPayload): Promise<SessionCredentials> {
    const response = env.useMockAuth
      ? await authMock.login(payload.identifier, payload.password)
      : await authApi.login(payload);

    return {
      accessToken: response.token,
      refreshToken: undefined,
      expiresAt: undefined,
      userId: response.user.id,
    };
  },

  async register(payload: RegisterPayload): Promise<SessionCredentials> {
    const identifier = payload.phone_number ?? payload.email ?? '';

    const response = env.useMockAuth
      ? await authMock.register(identifier, payload.full_name, payload.password)
      : await authApi.register(payload);

    return {
      accessToken: response.token,
      refreshToken: undefined,
      expiresAt: undefined,
      userId: response.user.id,
    };
  },
} as const;

export type PasswordProvider = typeof passwordProvider;
export type { AuthProvider };