// src/features/auth/hooks/useLogin.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { passwordProvider } from '@/features/auth/providers/password.provider';
import { sessionService } from '@/features/auth/services/session.service';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';
import { useProviderStore } from '@/features/provider/store/provider.store';
import type { LoginPayload } from '@/features/auth/types/auth.types';

export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useSessionStore((s) => s.setSession);
  const setUser = useUserStore((s) => s.setUser);
  const setProfile = useProviderStore((s) => s.setProfile);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      // 1. Login
      const credentials = await passwordProvider.login(payload);

      // 2. Store session
      const session = await sessionService.createSession(credentials);
      setSession(session);

      // 3. Load user + provider profile
      try {
        const user = await authApi.getMe();
        setUser(user);
        queryClient.setQueryData(['auth', 'me'], user);

        // 4. Set provider profile (kama ni PROVIDER)
        if (user.role === 'PROVIDER' && user.provider_profile) {
          setProfile(user.provider_profile);
        }
      } catch {
        // Non-fatal.
      }

      return session;
    },
  });
}
