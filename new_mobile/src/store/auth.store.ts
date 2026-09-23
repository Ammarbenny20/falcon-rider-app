import { create } from 'zustand';

import type { User } from '@/features/auth/types/auth.types';

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  setSession: (token: string, user: User) => void;
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
