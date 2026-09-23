// src/features/auth/hooks/useMe.ts

import { useQuery } from '@tanstack/react-query';

import { env } from '@/config/env';
import { authApi } from '@/features/auth/api/auth.api';
import { authMock } from '@/features/auth/services/auth.mock';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';
import { useProviderStore } from '@/features/provider/store/provider.store';

export function useMe() {
  const status = useSessionStore((s) => s.status);
  const session = useSessionStore((s) => s.session);
  const setUser = useUserStore((s) => s.setUser);
  const setProfile = useProviderStore((s) => s.setProfile);

  return useQuery({
    queryKey: ['auth', 'me', session?.userId],
    queryFn: async () => {
      if (env.useMockAuth) {
        const identifier = session?.userId?.replace('mock-', '') ?? '';
        const user = await authMock.getMe(identifier);
        setUser(user);
        if (user.role === 'PROVIDER' && user.provider_profile) {
          setProfile(user.provider_profile);
        }
        return user;
      }

      const user = await authApi.getMe();
      setUser(user);

      if (user.role === 'PROVIDER' && user.provider_profile) {
        setProfile(user.provider_profile);
      }

      return user;
    },
    enabled: status === 'authenticated' && Boolean(session),
  });
}
