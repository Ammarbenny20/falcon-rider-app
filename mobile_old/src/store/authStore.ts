import { create } from "zustand";
import type { User } from "../types";
import { authApi } from "../api/authApi";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

// Swap this for a real secure-storage adapter (expo-secure-store) at integration time.
let persistedToken: string | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,

  requestOtp: async (phone: string) => {
    set({ isLoading: true });
    try {
      await authApi.requestOtp(phone);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (phone: string, code: string, role?: string) => {
    set({ isLoading: true });
    try {
      const { token, user } = await authApi.verifyOtp(phone, code, role);
      persistedToken = token;
      set({ token, user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      persistedToken = null;
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  hydrate: async () => {
    if (!persistedToken) return;
    set({ token: persistedToken });
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true });
    } catch {
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));