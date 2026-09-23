// src/features/auth/providers/types.ts

import type { SessionCredentials } from '@/features/auth/types/session.types';

export type AuthProvider<TInput> = {
  id: 'password' | 'otp' | 'google' | 'apple';
  authenticate: (input: TInput) => Promise<SessionCredentials>;
};