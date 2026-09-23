// src/features/auth/services/session.service.ts

import { sessionStorage } from '@/features/auth/services/session-storage.service';
import type {
  RefreshResult,
  Session,
  SessionCredentials,
} from '@/features/auth/types/session.types';

function toSession(credentials: SessionCredentials): Session {
  return {
    accessToken: credentials.accessToken,
    refreshToken: credentials.refreshToken ?? null,
    expiresAt: credentials.expiresAt ?? null,
    userId: credentials.userId,
    createdAt: new Date().toISOString(),
  };
}

function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  if (!session.accessToken) return false;
  if (session.expiresAt === null) return true;

  const expiry = Date.parse(session.expiresAt);
  if (Number.isNaN(expiry)) return false;

  return Date.now() < expiry;
}

export const sessionService = {
  async createSession(credentials: SessionCredentials): Promise<Session> {
    const session = toSession(credentials);
    await sessionStorage.setSession(session);
    return session;
  },

  async restoreSession(): Promise<Session | null> {
    const session = await sessionStorage.getSession();
    if (!session) return null;
    if (!isSessionValid(session)) {
      await sessionStorage.clearSession();
      return null;
    }
    return session;
  },

  async getSession(): Promise<Session | null> {
    return sessionStorage.getSession();
  },

  async refreshSession(): Promise<RefreshResult> {
    const current = await sessionStorage.getSession();
    if (!current) {
      return { outcome: 'failed', reason: 'no_refresh_token' };
    }
    if (!current.refreshToken) {
      return { outcome: 'not_attempted' };
    }
    // Future: perform refresh call
    return { outcome: 'not_attempted' };
  },

  async clearSession(): Promise<void> {
    await sessionStorage.clearSession();
  },

  isSessionValid,
};