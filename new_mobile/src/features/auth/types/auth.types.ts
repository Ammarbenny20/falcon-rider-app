// src/features/auth/types/auth.types.ts

// ============================================================================
// User & Role Types
// ============================================================================

export type UserRole = 'PASSENGER' | 'PROVIDER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

/**
 * Provider operational status.
 * A PROVIDER can be authenticated but not yet operationally active.
 * This is separate from User.status (which handles auth-level status).
 */
export type ProviderStatus =
  | 'REGISTERED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'DEACTIVATED';

/**
 * The authenticated user object returned by the backend.
 *
 * NOTE: `provider_status` is only present when `role === 'PROVIDER'`.
 * The frontend uses it to decide whether to show the driver dashboard
 * or the verification-pending screen.
 */
export type User = {
  id: string;
  phone_number: string | null;
  email: string | null;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  is_verified: boolean;
  created_at: string;
  provider_status?: ProviderStatus;
};

// ============================================================================
// Authentication Providers
// ============================================================================

/**
 * Discriminator for the auth method used to create a session.
 * Stored with the session for audit purposes.
 */
export type AuthProviderId = 'password' | 'otp' | 'google' | 'apple';

// ============================================================================
// Login
// ============================================================================

/**
 * Login payload.
 *
 * `identifier` accepts either a phone number (E.164, e.g. "+255700000000")
 * or an email address. The backend resolves which one it is.
 */
export type LoginPayload = {
  identifier: string;
  password: string;
};

// ============================================================================
// Register
// ============================================================================

/**
 * Registration payload.
 *
 * At least one of `phone_number` or `email` must be provided.
 * The backend enforces this; the frontend should too via the schema.
 */
export type RegisterPayload = {
  full_name: string;
  phone_number?: string;
  email?: string;
  password: string;
  password_confirm: string;
};

// ============================================================================
// Password Reset
// ============================================================================

/**
 * Request a password reset code (OTP).
 */
export type ForgotPasswordPayload = {
  identifier: string;
};

/**
 * Confirm password reset with the OTP and set a new password.
 */
export type ResetPasswordPayload = {
  identifier: string;
  otp: string;
  new_password: string;
  new_password_confirm: string;
};

// ============================================================================
// Login / Register Response
// ============================================================================

/**
 * Response shape from /auth/login/ and /auth/register/.
 * Same shape for both — the frontend treats them identically.
 */
export type AuthResponse = {
  token: string;
  user: User;
};

// ============================================================================
// OTP (kept for verification & recovery flows)
// ============================================================================

/**
 * Request a verification OTP (phone/email verification).
 * NOTE: This is NOT the primary login flow.
 */
export type OtpRequestPayload = {
  identifier: string;
};

/**
 * Verify an OTP (for phone/email verification or password reset).
 */
export type OtpVerifyPayload = {
  identifier: string;
  otp: string;
};

// ============================================================================
// Legacy (kept during transition; safe to remove after refactor)
// ============================================================================

/**
 * @deprecated Legacy register response. Use AuthResponse instead.
 */
export type RegisterResponse = AuthResponse;

/**
 * @deprecated Legacy OTP verify response. Use AuthResponse instead.
 */
export type OtpVerifyResponse = AuthResponse;