import { secureStorage } from '@/services/storage/secure-storage';
import type { Session } from '@/features/auth/types/session.types';

const SESSION_KEY = 'auth.session.v1';
const LEGACY_TOKEN_KEY = 'auth_token';

function isValidSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;

  const s = value as Record<string, unknown>;

  const hasValidAccessToken =
    typeof s.accessToken === 'string' && s.accessToken.length > 0;

  const hasValidUserId =
    typeof s.userId === 'string' && s.userId.length > 0;

  const hasValidCreatedAt =
    typeof s.createdAt === 'string' && s.createdAt.length > 0;

  const hasValidRefreshToken =
    s.refreshToken === null || typeof s.refreshToken === 'string';

  const hasValidExpiresAt =
    s.expiresAt === null || typeof s.expiresAt === 'string';

  return (
    hasValidAccessToken &&
    hasValidUserId &&
    hasValidCreatedAt &&
    hasValidRefreshToken &&
    hasValidExpiresAt
  );
}

export const sessionStorage = {
  async setSession(session: Session): Promise<void> {
    const serialized = JSON.stringify(session);
    await secureStorage.set(SESSION_KEY, serialized);
  },

  async getSession(): Promise<Session | null> {
    let raw: string | null = null;

    try {
      raw = await secureStorage.get(SESSION_KEY);
    } catch {
      return null;
    }

    if (!raw) return null;

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      await this.clearSession();
      return null;
    }

    if (!isValidSession(parsed)) {
      await this.clearSession();
      return null;
    }

    return parsed;
  },

  async clearSession(): Promise<void> {
    await Promise.allSettled([
      secureStorage.remove(SESSION_KEY),
      secureStorage.remove(LEGACY_TOKEN_KEY),
    ]);
  },

  async hasSession(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  },
};
