// src/features/auth/hooks/useVerifyOtp.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { useUserStore } from '@/features/auth/store/user.store';
import type {
  OtpRequestPayload,
  OtpVerifyPayload,
  User,
} from '@/features/auth/types/auth.types';

/**
 * Request an OTP for phone/email verification.
 *
 * NOT the primary login flow. Used when an authenticated user needs to
 * verify their phone or email.
 */
export function useRequestVerificationOtp() {
  return useMutation({
    mutationFn: (payload: OtpRequestPayload) =>
      authApi.requestVerificationOtp(payload),
  });
}

/**
 * Confirm phone/email verification with the OTP.
 *
 * Updates the cached user's `is_verified` flag on success.
 */
export function useVerifyOtp() {
  const queryClient = useQueryClient();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: OtpVerifyPayload) =>
      authApi.confirmVerificationOtp(payload),
    onSuccess: (response) => {
      const current = queryClient.getQueryData<User>(['auth', 'me']);
      if (current) {
        const updated = { ...current, is_verified: response.is_verified };
        queryClient.setQueryData(['auth', 'me'], updated);
        setUser(updated);
      }
    },
  });
}