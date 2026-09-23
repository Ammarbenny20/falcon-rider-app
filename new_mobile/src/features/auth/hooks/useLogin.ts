// src/features/auth/hooks/useLogin.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { isBiometricEnabled } from '@/features/auth/biometric/preferences';
import { passwordProvider } from '@/features/auth/providers/password.provider';
import { sessionService } from '@/features/auth/services/session.service';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';
import type { LoginPayload } from '@/features/auth/types/auth.types';

/**
 * Log in with phone/email + password.
 *
 * Returns `{ session, shouldOfferBiometric }` so the caller can decide
 * whether to route to biometric-setup or straight to the app.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useSessionStore((s) => s.setSession);
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const credentials = await passwordProvider.login(payload);
      const session = await sessionService.createSession(credentials);
      setSession(session);

      try {
        const user = await authApi.getMe();
        setUser(user);
        queryClient.setQueryData(['auth', 'me'], user);
      } catch {
        // Non-fatal.
      }

      const biometricAlreadyEnabled = await isBiometricEnabled();
      return { session, shouldOfferBiometric: !biometricAlreadyEnabled };
    },
  });
}