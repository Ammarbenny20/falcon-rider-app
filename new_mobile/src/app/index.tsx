// src/app/index.tsx

import { Redirect } from 'expo-router';

import { useSession } from '@/features/auth/hooks/useSession';

/**
 * Root route.
 *
 * Normally unreachable because _layout.tsx branches at the layout level.
 * Exists so Expo Router has a route at "/". Redirects defensively based on
 * session state in case it is ever rendered directly (e.g., deep link).
 */
export default function Index() {
  const { isAuthenticated, isRestoring } = useSession();

  if (isRestoring) return null;

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/welcome'} />;
}