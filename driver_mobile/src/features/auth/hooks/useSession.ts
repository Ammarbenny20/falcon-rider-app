// src/features/auth/hooks/useSession.ts

import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';

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
  };
}