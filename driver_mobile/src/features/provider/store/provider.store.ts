// src/features/provider/store/provider.store.ts

import { create } from 'zustand';

import type {
  CapabilityStatus,
  CommunityAvailability,
  ProfessionalAvailability,
  ProviderCapability,
  ProviderProfile,
} from '@/features/provider/types/provider.types';

type ProviderState = {
  profile: ProviderProfile | null;
  professionalAvailability: ProfessionalAvailability;
  communityAvailability: CommunityAvailability;

  setProfile: (profile: ProviderProfile | null) => void;
  setProfessionalAvailability: (status: ProfessionalAvailability) => void;
  toggleProfessionalOnline: () => void;
  setCommunityAvailability: (status: CommunityAvailability) => void;
  hasCapability: (capability: ProviderCapability) => boolean;
  isCapabilityApproved: (capability: ProviderCapability) => boolean;
  clear: () => void;
};

const DEFAULT_CAPABILITY_STATUS: Record<ProviderCapability, CapabilityStatus> = {
  PROFESSIONAL_SERVICE: 'NOT_ENABLED',
  COMMUNITY_JOURNEY: 'NOT_ENABLED',
};

export const useProviderStore = create<ProviderState>((set, get) => ({
  profile: null,
  professionalAvailability: 'OFFLINE',
  communityAvailability: 'NOT_SHARING',

  setProfile: (profile) =>
    set({
      profile,
      professionalAvailability: profile?.professional_availability ?? 'OFFLINE',
      communityAvailability: profile?.community_availability ?? 'NOT_SHARING',
    }),

  setProfessionalAvailability: (professionalAvailability) =>
    set({ professionalAvailability }),

  toggleProfessionalOnline: () => {
    const current = get().professionalAvailability;
    set({
      professionalAvailability: current === 'ONLINE' ? 'OFFLINE' : 'ONLINE',
    });
  },

  setCommunityAvailability: (communityAvailability) =>
    set({ communityAvailability }),

  hasCapability: (capability) => {
    const profile = get().profile;
    return profile?.capabilities.includes(capability) ?? false;
  },

  isCapabilityApproved: (capability) => {
    const profile = get().profile;
    if (!profile) return false;
    return (
      (profile.capability_status[capability] ??
        DEFAULT_CAPABILITY_STATUS[capability]) === 'APPROVED'
    );
  },

  clear: () =>
    set({
      profile: null,
      professionalAvailability: 'OFFLINE',
      communityAvailability: 'NOT_SHARING',
    }),
}));