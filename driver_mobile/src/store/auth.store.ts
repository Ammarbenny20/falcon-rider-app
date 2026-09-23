/**
 * Falcon Rider — Auth Store (Driver App)
 */

import { create } from 'zustand';

type AuthState = {
  token: string | null;
  user: unknown | null;
  isHydrated: boolean;
  setSession: (token: string, user: unknown) => void;
  clearSession: () => void;
  setHydrated: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  setSession: (token, user) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
  setHydrated: (token) => set({ token, isHydrated: true }),
}));
