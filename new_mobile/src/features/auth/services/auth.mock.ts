// src/features/auth/services/auth.mock.ts

import type { User } from '@/features/auth/types/auth.types';

/**
 * Mock user factory.
 *
 * Used when EXPO_PUBLIC_USE_MOCK_AUTH=true. Allows the frontend to be
 * demoed before the real backend is ready.
 *
 * The mock is deterministic per identifier: the same identifier always
 * returns the same user, so refreshing the app keeps you logged in.
 */
function makeMockUser(identifier: string, fullName?: string): User {
  const isEmail = identifier.includes('@');
  const handle = isEmail
    ? identifier.split('@')[0]
    : identifier.replace(/[^\d]/g, '').slice(-4);

  return {
    id: `mock-${handle}`,
    phone_number: isEmail ? null : identifier,
    email: isEmail ? identifier : null,
    full_name: fullName ?? `Falcon User ${handle}`,
    role: 'PASSENGER',
    status: 'ACTIVE',
    is_verified: true,
    created_at: new Date().toISOString(),
  };
}

export const authMock = {
  async login(identifier: string, _password: string) {
    // Simulate network delay so loading states are visible.
    await new Promise((resolve) => setTimeout(resolve, 600));
    const user = makeMockUser(identifier);
    return { token: `mock-token-${user.id}`, user };
  },

  async register(identifier: string, fullName: string, _password: string) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const user = makeMockUser(identifier, fullName);
    return { token: `mock-token-${user.id}`, user };
  },

  async getMe(identifier: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return makeMockUser(identifier);
  },
};