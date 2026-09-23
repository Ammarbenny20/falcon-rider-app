// src/features/auth/hooks/useSession.ts

import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';
import type { SessionStatus } from '@/features/auth/types/session.types';

/**
 * Public session hook.
 *
 * Components should use this instead of importing the store directly, so
 * that future internal changes (e.g., adding derived state) do not require
 * touching every screen.
 */
export function useSession() {
  const status = useSessionStore((s) => s.status);
  const session = useSessionStore((s) => s.session);
  const user = useUserStore((s) => s.user);

  return {
    status,
    session,
    user,
    isAuthenticated: status === 'authenticated',
    isRestoring: status === 'restoring',
    isUnauthenticated: status === 'unauthenticated',
  } satisfies {
    status: SessionStatus;
    session: ReturnType<typeof useSessionStore.getState>['session'];
    user: ReturnType<typeof useUserStore.getState>['user'];
    isAuthenticated: boolean;
    isRestoring: boolean;
    isUnauthenticated: boolean;
  };
}