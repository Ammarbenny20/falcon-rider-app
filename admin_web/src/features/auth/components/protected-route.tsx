'use client';

/**
 * Falcon Rider Admin Portal — Protected Route
 *
 * Redirects unauthenticated users to login.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import { FullPageLoader } from '@/components/shared/loading-state';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) return <FullPageLoader />;
  if (!isAuthenticated) return <FullPageLoader />;

  return <>{children}</>;
}