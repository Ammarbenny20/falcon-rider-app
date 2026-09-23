/**
 * Falcon Rider Admin Portal — Auth Types
 *
 * Types specific to authentication and authorization.
 */

import type { Role, Permission } from '@/config/permissions';

// ─────────────────────────────────────────
// USER
// ─────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

// ─────────────────────────────────────────
// SESSION
// ─────────────────────────────────────────

export interface AuthSession {
  user: AdminUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: AdminUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

// ─────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

// ─────────────────────────────────────────
// AUTH STATE (Zustand)
// ─────────────────────────────────────────

export interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  // Actions
  login: (session: AuthSession) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setUser: (user: AdminUser) => void;
  setHydrated: (hydrated: boolean) => void;

  // Permission checks
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
}