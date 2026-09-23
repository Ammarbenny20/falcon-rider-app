/**
 * Falcon Rider Admin Portal — Auth Store
 *
 * Centralized authentication state.
 * Persists to localStorage for session continuity.
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AdminUser, AuthState, AuthSession } from '../types/auth.types';
import type { Permission } from '@/config/permissions';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      // Actions
      login: (session: AuthSession) => {
        set({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken ?? null,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setAccessToken: (token: string) => {
        set({ accessToken: token });
      },

      setUser: (user: AdminUser) => {
        set({ user });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },

      // Permission checks
      hasPermission: (permission: Permission) => {
        const user = get().user;
        if (!user) return false;
        return user.permissions.includes(permission);
      },

      hasAnyPermission: (permissions: Permission[]) => {
        const user = get().user;
        if (!user) return false;
        return permissions.some((p) => user.permissions.includes(p));
      },

      hasAllPermissions: (permissions: Permission[]) => {
        const user = get().user;
        if (!user) return false;
        return permissions.every((p) => user.permissions.includes(p));
      },

      hasRole: (role) => {
        const user = get().user;
        if (!user) return false;
        return user.role === role;
      },

      hasAnyRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: 'falcon-rider-admin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);