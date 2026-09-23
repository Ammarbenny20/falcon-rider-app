// src/features/auth/store/session.store.ts

import { create } from 'zustand';

import type {
  Session,
  SessionState,
  SessionStatus,
} from '@/features/auth/types/session.types';

export const useSessionStore = create<SessionState>((set) => ({
  status: 'unknown',
  session: null,

  setStatus: (status: SessionStatus) => set({ status }),

  setSession: (session: Session) =>
    set({ session, status: 'authenticated' }),

  clearSession: () =>
    set({ session: null, status: 'unauthenticated' }),
}));