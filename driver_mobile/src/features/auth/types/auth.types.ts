// src/features/auth/types/auth.types.ts

import type {
  ProviderProfile,
  ProviderCapability,
  VerificationStatus,
} from '@/features/provider/types/provider.types';

export type UserRole = 'PASSENGER' | 'PROVIDER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export type ProviderVerificationStatus = VerificationStatus;

export type User = {
  id: string;
  phone_number: string | null;
  email: string | null;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  is_verified: boolean;
  provider_status?: ProviderVerificationStatus | null;
  provider_profile?: ProviderProfile | null;
  created_at: string;
  capabilities?: ProviderCapability[];
  verification_status?: ProviderVerificationStatus;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  full_name: string;
  phone_number?: string;
  email?: string;
  password: string;
  password_confirm: string;
};
