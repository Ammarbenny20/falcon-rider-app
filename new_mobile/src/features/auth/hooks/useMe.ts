// src/features/auth/hooks/useMe.ts

import { useQuery } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { authMock } from '@/features/auth/services/auth.mock';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';
import { env } from '@/config/env';

/**
 * Fetch the current authenticated user.
 *
 * In mock mode, the user is derived from the session's userId.
 */
export function useMe() {
  const status = useSessionStore((s) => s.status);
  const session = useSessionStore((s) => s.session);
  const setUser = useUserStore((s) => s.setUser);

  return useQuery({
    queryKey: ['auth', 'me', session?.userId],
    queryFn: async () => {
      if (env.useMockAuth) {
        const identifier = session?.userId?.replace('mock-', '') ?? '';
        const user = await authMock.getMe(identifier);
        setUser(user);
        return user;
      }

      const user = await authApi.getMe();
      setUser(user);
      return user;
    },
    enabled: status === 'authenticated' && Boolean(session),
  });
}