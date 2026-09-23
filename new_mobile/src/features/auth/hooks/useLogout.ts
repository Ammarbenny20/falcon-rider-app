// src/features/auth/hooks/useLogout.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { sessionService } from '@/features/auth/services/session.service';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';

/**
 * Log out the current user.
 *
 * Always clears local state, even if the backend call fails (offline use).
 * The backend call is best-effort: it allows the server to invalidate the
 * token if supported, but is not required for a secure local logout.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const clearSessionStore = useSessionStore((s) => s.clearSession);
  const clearUser = useUserStore((s) => s.clearUser);

  return useMutation({
    mutationFn: () => authApi.logout(),

    onSettled: async () => {
      // 1. Clear persisted credentials (SecureStore).
      await sessionService.clearSession();

      // 2. Clear in-memory session state.
      clearSessionStore();

      // 3. Clear in-memory user state.
      clearUser();

      // 4. Clear React Query cache so no stale data survives logout.
      queryClient.clear();
    },
  });
}