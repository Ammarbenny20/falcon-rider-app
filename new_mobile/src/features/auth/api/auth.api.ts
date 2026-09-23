// src/features/auth/api/auth.api.ts

import { apiClient } from '@/services/api/client';
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  OtpRequestPayload,
  OtpVerifyPayload,
} from '@/features/auth/types/auth.types';

/**
 * Pure API functions for auth endpoints.
 *
 * These functions do not know about sessions, stores, or navigation.
 * They only call endpoints. Session creation happens in providers/.
 *
 * Contract reference: Falcon Rider Backend Prompt, Section 6.1.
 */
export const authApi = {
  // ────────────────────────────────────────────────────────────────────────
  // Primary authentication
  // ────────────────────────────────────────────────────────────────────────

  /**
   * Register a new account with phone/email + password.
   * Public endpoint (no session required).
   */
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register/', payload, {
      skipAuth: true,
    }),

  /**
   * Log in with phone or email + password.
   * Public endpoint (no session required).
   */
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login/', payload, {
      skipAuth: true,
    }),

  /**
   * Log out the current user. Invalidates the token server-side.
   */
  logout: () =>
    apiClient.post<{ detail: string }>('/auth/logout/'),

  /**
   * Fetch the current authenticated user.
   */
  getMe: () =>
    apiClient.get<User>('/auth/me/'),

  /**
   * Update the current user's profile.
   */
  updateMe: (payload: Partial<Pick<User, 'full_name' | 'email'>>) =>
    apiClient.patch<User>('/auth/me/', payload),

  // ────────────────────────────────────────────────────────────────────────
  // Password recovery (uses OTP)
  // ────────────────────────────────────────────────────────────────────────

  /**
   * Request a password reset code.
   * Public endpoint.
   *
   * NOTE: The backend always returns 200 to avoid revealing whether an
   * account exists. The frontend should not assume the account exists
   * just because this call succeeds.
   */
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<{ detail: string }>('/auth/password-reset/', payload, {
      skipAuth: true,
    }),

  /**
   * Confirm password reset with OTP and set a new password.
   * Public endpoint.
   */
  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<{ detail: string }>(
      '/auth/password-reset/confirm/',
      payload,
      { skipAuth: true },
    ),

  // ────────────────────────────────────────────────────────────────────────
  // Phone/Email verification (uses OTP)
  // ────────────────────────────────────────────────────────────────────────

  /**
   * Request a verification code for phone/email.
   * Requires an authenticated session.
   */
  requestVerificationOtp: (payload: OtpRequestPayload) =>
    apiClient.post<{ detail: string }>('/auth/verify-phone/', payload),

  /**
   * Confirm verification with the OTP.
   * Requires an authenticated session.
   */
  confirmVerificationOtp: (payload: OtpVerifyPayload) =>
    apiClient.post<{ detail: string; is_verified: boolean }>(
      '/auth/verify-phone/confirm/',
      payload,
    ),
};