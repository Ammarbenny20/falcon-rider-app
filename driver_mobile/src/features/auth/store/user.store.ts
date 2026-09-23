// src/features/auth/store/user.store.ts

import { create } from 'zustand';

import type { User } from '@/features/auth/types/auth.types';

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));