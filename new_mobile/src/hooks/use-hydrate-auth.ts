// src/hooks/use-hydrate-auth.ts

import { useEffect } from 'react';

import { sessionService } from '@/features/auth/services/session.service';
import { useSessionStore } from '@/features/auth/store/session.store';

/**
 * Restore the persisted session on app launch.
 *
 * Transitions: unknown → restoring → authenticated | unauthenticated.
 *
 * Must be called exactly once, from the root layout. Do not call it from
 * individual screens.
 */
export function useHydrateAuth(): void {
  const setStatus = useSessionStore((s) => s.setStatus);
  const setSession = useSessionStore((s) => s.setSession);
  const clearSession = useSessionStore((s) => s.clearSession);

  useEffect(() => {
    let cancelled = false;

    setStatus('restoring');

    sessionService
      .restoreSession()
      .then((session) => {
        if (cancelled) return;
        if (session) {
          setSession(session);
        } else {
          clearSession();
        }
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
      });

    return () => {
      cancelled = true;
    };
    // Intentionally empty deps: this must run once per app launch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}