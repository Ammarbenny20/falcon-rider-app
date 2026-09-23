'use client';

/**
 * Falcon Rider Admin Portal — useAuth
 */

import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  return useAuthStore();
}
