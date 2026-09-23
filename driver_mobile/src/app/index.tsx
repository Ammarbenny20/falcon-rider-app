// src/app/index.tsx

import { Redirect } from 'expo-router';

import { useSession } from '@/features/auth/hooks/useSession';

export default function Index() {
  const { isAuthenticated, isRestoring } = useSession();

  if (isRestoring) return null;

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/welcome'} />;
}