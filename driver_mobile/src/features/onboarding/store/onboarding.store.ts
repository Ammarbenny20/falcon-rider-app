// src/features/onboarding/store/onboarding.store.ts

import { create } from 'zustand';

import type {
  ContactInfo,
  IdentityInfo,
  OnboardingDraft,
  OnboardingStep,
  VehicleInfo,
} from '@/features/onboarding/types/onboarding.types';
import type { ProviderCapability } from '@/features/provider/types/provider.types';

type OnboardingState = OnboardingDraft & {
  setIdentity: (identity: IdentityInfo) => void;
  setContact: (contact: ContactInfo) => void;
  setVehicle: (vehicle: VehicleInfo) => void;
  setCapabilities: (capabilities: ProviderCapability[]) => void;
  toggleCapability: (capability: ProviderCapability) => void;
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
};

const initialDraft: OnboardingDraft = {
  identity: null,
  contact: null,
  vehicle: null,
  selectedCapabilities: [],
  currentStep: 'identity',
};

const STEP_ORDER: OnboardingStep[] = [
  'identity',
  'contact',
  'vehicle',
  'capability_selection',
  'review',
];

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialDraft,

  setIdentity: (identity) => set({ identity }),
  setContact: (contact) => set({ contact }),
  setVehicle: (vehicle) => set({ vehicle }),

  setCapabilities: (selectedCapabilities) =>
    set({ selectedCapabilities }),

  toggleCapability: (capability) => {
    const current = get().selectedCapabilities;
    const next = current.includes(capability)
      ? current.filter((c) => c !== capability)
      : [...current, capability];
    set({ selectedCapabilities: next });
  },

  setStep: (currentStep) => set({ currentStep }),

  nextStep: () => {
    const current = get().currentStep;
    const index = STEP_ORDER.indexOf(current);
    if (index >= 0 && index < STEP_ORDER.length - 1) {
      set({ currentStep: STEP_ORDER[index + 1] });
    }
  },

  previousStep: () => {
    const current = get().currentStep;
    const index = STEP_ORDER.indexOf(current);
    if (index > 0) {
      set({ currentStep: STEP_ORDER[index - 1] });
    }
  },

  reset: () => set(initialDraft),
}));