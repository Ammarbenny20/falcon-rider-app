import type { SessionCredentials } from '@/features/auth/types/session.types';

export type AuthProvider<TInput> = {
  id: 'otp' | 'google' | 'apple';
  authenticate: (input: TInput) => Promise<SessionCredentials>;
};
