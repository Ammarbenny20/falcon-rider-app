// src/features/auth/types/session.types.ts

/**
 * The lifecycle state of the application's session.
 *
 * This is a finite state machine. Only these states are valid.
 *
 * Flow on app launch:
 *   unknown → restoring → (authenticated | unauthenticated)
 *
 * Flow on access token expiry (future, when refresh is available):
 *   authenticated → refreshing → (authenticated | unauthenticated)
 *
 * `expired` is intentionally NOT a stable state. It is a transition trigger
 * that moves the session to `unauthenticated` (or `refreshing`, if refresh
 * is supported). This avoids state ambiguity.
 */
export type SessionStatus =
  | 'unknown'         // App just launched; nothing has happened yet.
  | 'restoring'       // Reading persisted session from secure storage.
  | 'authenticated'   // A valid session exists.
  | 'refreshing'      // Access token expired; refresh in progress. (Future.)
  | 'unauthenticated'; // No valid session; user must authenticate.

/**
 * Credentials returned by an authentication provider (OTP, Google, Apple, …).
 *
 * The session layer accepts these and converts them into a persisted Session.
 * Providers do not create sessions themselves.
 *
 * `accessToken` is required. `refreshToken` and `expiresAt` are optional
 * because the current backend issues a single non-expiring token.
 * When the backend later supports refresh tokens, providers populate these
 * fields and the session layer automatically uses them.
 */
export type SessionCredentials = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string; // ISO 8601 timestamp
  userId: string;
};

/**
 * The persisted session.
 *
 * This is what we write to SecureStore and read back on launch.
 *
 * Note on token type: the current backend uses DRF Token authentication,
 * which means the access token is a non-expiring opaque string sent as
 * `Authorization: Token <token>`. The session layer does not care about
 * the token format; it only knows it must attach it to requests.
 */
export type Session = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null; // ISO 8601 or null
  userId: string;
  createdAt: string; // ISO 8601; when the session was first created
};

/**
 * The public API surface of the session store.
 *
 * Kept intentionally small. Consumers use `useSession()` (Step 7), not this
 * type directly, but defining it here keeps the contract explicit and shared
 * between the store and the service.
 */
export type SessionState = {
  status: SessionStatus;
  session: Session | null;

  // Actions
  setStatus: (status: SessionStatus) => void;
  setSession: (session: Session) => void;
  clearSession: () => void;
};

/**
 * Result of a session refresh attempt.
 *
 * Used to make refresh logic explicit and testable.
 * `not_attempted` is used when the backend does not support refresh
 * (i.e., the current backend state).
 */
export type RefreshResult =
  | { outcome: 'success'; session: Session }
  | { outcome: 'failed'; reason: RefreshFailureReason }
  | { outcome: 'not_attempted' };

export type RefreshFailureReason =
  | 'no_refresh_token'      // Backend did not issue a refresh token.
  | 'network_error'         // Could not reach the server.
  | 'invalid_refresh_token' // Backend rejected the refresh token.
  | 'server_error';         // 5xx.