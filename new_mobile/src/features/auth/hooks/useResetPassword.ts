// src/features/auth/hooks/useResetPassword.ts

import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import type { ResetPasswordPayload } from '@/features/auth/types/auth.types';

/**
 * Confirm password reset with the OTP and set a new password.
 *
 * On success, all existing sessions on all devices are invalidated by
 * the backend. The user must log in again.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });
}