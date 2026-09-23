// src/features/auth/types/session.types.ts

export type SessionStatus =
  | 'unknown'
  | 'restoring'
  | 'authenticated'
  | 'refreshing'
  | 'unauthenticated';

export type SessionCredentials = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  userId: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
  userId: string;
  createdAt: string;
};

export type SessionState = {
  status: SessionStatus;
  session: Session | null;
  setStatus: (status: SessionStatus) => void;
  setSession: (session: Session) => void;
  clearSession: () => void;
};

export type RefreshResult =
  | { outcome: 'success'; session: Session }
  | { outcome: 'failed'; reason: RefreshFailureReason }
  | { outcome: 'not_attempted' };

export type RefreshFailureReason =
  | 'no_refresh_token'
  | 'network_error'
  | 'invalid_refresh_token'
  | 'server_error';