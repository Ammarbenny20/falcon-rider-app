// src/features/auth/services/auth.mock.ts

import type { User } from '@/features/auth/types/auth.types';

function makeMockUser(identifier: string, fullName?: string): User {
  const isEmail = identifier.includes('@');
  const handle = isEmail
    ? identifier.split('@')[0]
    : identifier.replace(/[^\d]/g, '').slice(-4);

  return {
    id: `mock-${handle}`,
    phone_number: isEmail ? null : identifier,
    email: isEmail ? identifier : null,
    full_name: fullName ?? `Provider ${handle}`,
    role: 'PROVIDER',
    status: 'ACTIVE',
    is_verified: true,
    created_at: new Date().toISOString(),
    capabilities: ['PRIVATE_JOURNEY'],
    verification_status: 'VERIFIED',
  };
}

export const authMock = {
  async login(identifier: string, _password: string) {
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