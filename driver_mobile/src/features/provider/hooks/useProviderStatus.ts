// src/features/provider/hooks/useProviderStatus.ts

import { useMemo } from 'react';

import { useProviderStore } from '@/features/provider/store/provider.store';

export type HomePrimaryAction =
  | { type: 'onboard' }
  | { type: 'pending_verification' }
  | { type: 'go_online' }
  | { type: 'go_offline' }
  | { type: 'share_journey' }
  | { type: 'view_journey'; journeyId: string }
  | { type: 'review_match'; journeyId: string }
  | { type: 'view_trip'; tripId: string };

export function useProviderStatus() {
  const profile = useProviderStore((s) => s.profile);
  const professionalAvailability = useProviderStore(
    (s) => s.professionalAvailability,
  );
  const communityAvailability = useProviderStore(
    (s) => s.communityAvailability,
  );
  const hasCapability = useProviderStore((s) => s.hasCapability);
  const isCapabilityApproved = useProviderStore((s) => s.isCapabilityApproved);

  return useMemo(() => {
    const hasProfessional = hasCapability('PROFESSIONAL_SERVICE');
    const hasCommunity = hasCapability('COMMUNITY_JOURNEY');
    const professionalApproved = isCapabilityApproved('PROFESSIONAL_SERVICE');
    const communityApproved = isCapabilityApproved('COMMUNITY_JOURNEY');

    let primaryAction: HomePrimaryAction = { type: 'onboard' };
    let label = 'Complete onboarding';

    if (!profile || (!hasProfessional && !hasCommunity)) {
      primaryAction = { type: 'onboard' };
      label = 'Set up your provider profile';
    } else if (
      (hasProfessional && !professionalApproved) ||
      (hasCommunity && !communityApproved)
    ) {
      primaryAction = { type: 'pending_verification' };
      label = 'Verification in progress';
    } else if (professionalApproved && professionalAvailability === 'ONLINE') {
      primaryAction = { type: 'go_offline' };
      label = 'You are available for trips';
    } else if (professionalApproved && professionalAvailability === 'OFFLINE') {
      primaryAction = { type: 'go_online' };
      label = 'You are offline';
    } else if (communityApproved && communityAvailability === 'NOT_SHARING') {
      primaryAction = { type: 'share_journey' };
      label = 'Share a journey';
    } else if (communityApproved) {
      primaryAction = { type: 'view_journey', journeyId: '' };
      label = 'Your journey is live';
    }

    return {
      hasProfessional,
      hasCommunity,
      professionalApproved,
      communityApproved,
      primaryAction,
      label,
    };
  }, [
    profile,
    professionalAvailability,
    communityAvailability,
    hasCapability,
    isCapabilityApproved,
  ]);
}