// src/features/auth/services/session.service.ts

import { sessionStorage } from '@/features/auth/services/session-storage.service';
import type {
  Session,
  SessionCredentials,
  RefreshResult,
} from '@/features/auth/types/session.types';

/**
 * Session service.
 *
 * The single source of truth for session lifecycle operations.
 *
 * Responsibilities:
 *   - Convert SessionCredentials (from any auth provider) into a Session.
 *   - Persist and restore sessions via sessionStorage.
 *   - Determine whether a session is currently valid.
 *   - Provide a refresh hook (architecturally present; no-op for current backend).
 *   - Clear sessions on logout.
 *
 * Non-responsibilities:
 *   - Network calls (that's the auth provider / API layer).
 *   - In-memory state (that's the store).
 *   - React integration (that's the hooks).
 *
 * This service is deliberately pure and testable in isolation.
 */

/**
 * Convert SessionCredentials into a Session.
 *
 * Rules:
 *   - `createdAt` is set now.
 *   - `refreshToken` and `expiresAt` fall back to null when not provided.
 *
 * The current backend issues a single non-expiring token, so credentials
 * will have `refreshToken: undefined` and `expiresAt: undefined`. When the
 * backend is upgraded, providers will populate these fields and no change
 * to this function is needed.
 */
function toSession(credentials: SessionCredentials): Session {
  return {
    accessToken: credentials.accessToken,
    refreshToken: credentials.refreshToken ?? null,
    expiresAt: credentials.expiresAt ?? null,
    userId: credentials.userId,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Whether a session is currently valid.
 *
 * A session is valid if:
 *   - It exists.
 *   - It has an access token.
 *   - It is not past its expiry (or has no expiry).
 *
 * A session with no `expiresAt` is treated as valid until the backend
 * rejects it with a 401. This matches the current backend behavior
 * (non-expiring DRF token).
 */
function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  if (!session.accessToken) return false;
  if (session.expiresAt === null) return true;

  const expiry = Date.parse(session.expiresAt);
  if (Number.isNaN(expiry)) {
    // Malformed expiry — treat as expired. Safe failure mode.
    return false;
  }

  return Date.now() < expiry;
}

export const sessionService = {
  /**
   * Create a new session from credentials and persist it.
   *
   * Called by auth providers after the backend confirms identity.
   */
  async createSession(credentials: SessionCredentials): Promise<Session> {
    const session = toSession(credentials);
    await sessionStorage.setSession(session);
    return session;
  },

  /**
   * Restore a persisted session, if any.
   *
   * Does NOT validate against the backend — that's the API client's job
   * on the first authenticated request. This function only checks local
   * expiry, so we can avoid sending requests we already know will fail.
   *
   * Returns null if no session exists or if the session is locally expired
   * (in which case it is also cleared from storage).
   */
  async restoreSession(): Promise<Session | null> {
    const session = await sessionStorage.getSession();

    if (!session) return null;

    if (!isSessionValid(session)) {
      // Locally expired. Clear and report as no session.
      await sessionStorage.clearSession();
      return null;
    }

    return session;
  },

  /**
   * Return the persisted session without expiry checks.
   *
   * Useful for reading `userId` or the access token for display or for
   * the API client. Prefer `restoreSession` when deciding whether the
   * user is authenticated.
   */
  async getSession(): Promise<Session | null> {
    return sessionStorage.getSession();
  },

  /**
   * Attempt to refresh an expired session.
   *
   * Current behavior (Phase 1):
   *   - The backend issues a single non-expiring token with no refresh token.
   *   - There is nothing to refresh.
   *   - Returns { outcome: 'not_attempted' }.
   *
   * Future behavior (when refresh tokens are available):
   *   - If no refresh token exists → 'no_refresh_token'.
   *   - Otherwise call the refresh endpoint via the API client.
   *   - On success → persist and return the new session.
   *   - On failure → return the appropriate reason.
   *
   * The API client (Step 5) is responsible for calling this method on 401
   * and retrying the original request.
   */
  async refreshSession(): Promise<RefreshResult> {
    const current = await sessionStorage.getSession();

    if (!current) {
      return { outcome: 'failed', reason: 'no_refresh_token' };
    }

    if (!current.refreshToken) {
      // Current backend: no refresh mechanism. Do not attempt.
      return { outcome: 'not_attempted' };
    }

    // Future: perform the refresh call. Left intentionally unimplemented
    // until the backend contract confirms the endpoint and response shape.
    //
    // This branch will be implemented in a later phase. Returning
    // 'not_attempted' here is the correct graceful-degradation behavior
    // per the architecture decision Q1/Q3.
    return { outcome: 'not_attempted' };
  },

  /**
   * Clear the persisted session.
   *
   * Never throws. See sessionStorage.clearSession for details.
   */
  async clearSession(): Promise<void> {
    await sessionStorage.clearSession();
  },

  /**
   * Public validity check.
   *
   * Exposed because the store and hooks need to make decisions without
   * reading the session twice.
   */
  isSessionValid,
};