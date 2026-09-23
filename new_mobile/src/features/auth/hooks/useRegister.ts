// src/features/auth/hooks/useRegister.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { passwordProvider } from '@/features/auth/providers/password.provider';
import { sessionService } from '@/features/auth/services/session.service';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';
import type { RegisterPayload } from '@/features/auth/types/auth.types';

/**
 * Register a new account and establish a session.
 *
 * Same lifecycle as useLogin — the only difference is the provider call.
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const setSession = useSessionStore((s) => s.setSession);
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const credentials = await passwordProvider.register(payload);
      const session = await sessionService.createSession(credentials);
      setSession(session);

      try {
        const user = await authApi.getMe();
        setUser(user);
        queryClient.setQueryData(['auth', 'me'], user);
      } catch {
        // Non-fatal.
      }

      return session;
    },
  });
}