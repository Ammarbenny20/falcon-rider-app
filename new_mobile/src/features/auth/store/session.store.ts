// src/features/auth/store/session.store.ts

import { create } from 'zustand';

import type {
  Session,
  SessionStatus,
  SessionState,
} from '@/features/auth/types/session.types';

/**
 * In-memory session state.
 *
 * The store is a passive container: it holds the current session and status.
 * All lifecycle decisions (create, restore, refresh, clear) are made by
 * sessionService, and the results are pushed into this store by the hooks.
 *
 * Initial status is 'unknown'. On app launch, use-hydrate-auth transitions
 * it to 'restoring', then to 'authenticated' or 'unauthenticated'.
 */
export const useSessionStore = create<SessionState>((set) => ({
  status: 'unknown',
  session: null,

  setStatus: (status: SessionStatus) => set({ status }),

  setSession: (session: Session) =>
    set({ session, status: 'authenticated' }),

  clearSession: () =>
    set({ session: null, status: 'unauthenticated' }),
}));