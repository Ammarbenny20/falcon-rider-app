// src/features/auth/hooks/useForgotPassword.ts

import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import type { ForgotPasswordPayload } from '@/features/auth/types/auth.types';

/**
 * Request a password reset code (OTP) for the given identifier.
 *
 * Backend always returns 200 to avoid revealing whether the account
 * exists. Do not treat success as proof that the account exists.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });
}