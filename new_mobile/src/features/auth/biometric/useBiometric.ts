// src/features/auth/biometric/useBiometric.ts

import { useCallback, useEffect, useState } from 'react';

import { biometricService } from '@/features/auth/biometric/biometric.service';
import type {
  BiometricAuthResult,
  BiometricAvailability,
} from '@/features/auth/biometric/biometric.types';

/**
 * Public biometric hook.
 *
 * Note: biometric is NOT a session gate in Phase 1. This hook exists so that
 * Phase 2+ features (biometric re-entry, biometric-protected actions) can be
 * added without refactoring.
 */
export function useBiometric() {
  const [availability, setAvailability] =
    useState<BiometricAvailability>('unknown');

  useEffect(() => {
    let cancelled = false;
    biometricService.checkAvailability().then((result) => {
      if (!cancelled) setAvailability(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const authenticate = useCallback(
    (reason = 'Authenticate to continue'): Promise<BiometricAuthResult> =>
      biometricService.authenticate(reason),
    [],
  );

  return {
    availability,
    isAvailable: availability === 'available',
    authenticate,
  };
}