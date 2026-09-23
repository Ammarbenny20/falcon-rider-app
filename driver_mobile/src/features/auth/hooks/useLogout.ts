// src/features/auth/hooks/useLogout.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { sessionService } from '@/features/auth/services/session.service';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUserStore } from '@/features/auth/store/user.store';

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSessionStore = useSessionStore((s) => s.clearSession);
  const clearUser = useUserStore((s) => s.clearUser);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: async () => {
      await sessionService.clearSession();
      clearSessionStore();
      clearUser();
      queryClient.clear();
    },
  });
}