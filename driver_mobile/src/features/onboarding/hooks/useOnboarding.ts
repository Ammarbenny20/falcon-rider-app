// src/features/onboarding/hooks/useOnboarding.ts

import { useCallback } from 'react';

import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import type { ProviderCapability } from '@/features/provider/types/provider.types';

export function useOnboarding() {
  const state = useOnboardingStore();

  const isReadyForReview = useCallback((): boolean => {
    const hasIdentity = Boolean(state.identity?.full_name);
    const hasContact = Boolean(
      state.contact?.phone_number || state.contact?.email,
    );
    const hasVehicle = Boolean(
      state.vehicle?.license_plate && state.vehicle?.transport_mode,
    );
    const hasCapabilities = state.selectedCapabilities.length > 0;

    return hasIdentity && hasContact && hasVehicle && hasCapabilities;
  }, [state]);

  const canProceedFromCapabilitySelection = useCallback(
    (): boolean => state.selectedCapabilities.length > 0,
    [state.selectedCapabilities],
  );

  const hasCapability = useCallback(
    (capability: ProviderCapability): boolean =>
      state.selectedCapabilities.includes(capability),
    [state.selectedCapabilities],
  );

  return {
    ...state,
    isReadyForReview,
    canProceedFromCapabilitySelection,
    hasCapability,
  };
}