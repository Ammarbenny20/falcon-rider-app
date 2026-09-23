// src/features/auth/providers/types.ts

import type { SessionCredentials } from '@/features/auth/types/session.types';

/**
 * The contract every authentication provider must satisfy.
 *
 * A provider's only job is to convert user input into SessionCredentials.
 * It does not create sessions, persist anything, or touch navigation.
 */
export type AuthProvider<TInput> = {
  id: 'password' | 'otp' | 'google' | 'apple';
  authenticate: (input: TInput) => Promise<SessionCredentials>;
};