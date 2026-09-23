// src/services/api/types.ts

/**
 * Options that can be passed to individual API client calls.
 *
 * Kept minimal on purpose. New options should only be added when a concrete
 * requirement forces them — not speculatively.
 */
export type RequestOptions = {
  /**
   * If true, the client will NOT attach an Authorization header.
   * Used for public endpoints (OTP request, OTP verify, health checks).
   */
  skipAuth?: boolean;
};