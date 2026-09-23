// src/hooks/use-hydrate-auth.ts

import { useEffect } from 'react';

// NOTE: Session service will be added in Kundi 5.
// For now this hook does nothing — it will hydrate the session from
// SecureStore once session.service.ts is ready.

export function useHydrateAuth(): void {
  useEffect(() => {
    // Will be implemented in Kundi 5 — Auth.
  }, []);
}