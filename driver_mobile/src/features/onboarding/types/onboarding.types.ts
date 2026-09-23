// src/features/onboarding/types/onboarding.types.ts

import type { ProviderCapability } from '@/features/provider/types/provider.types';

export type OnboardingStep =
  | 'identity'
  | 'contact'
  | 'profile'
  | 'vehicle'
  | 'capability_selection'
  | 'professional_details'
  | 'community_details'
  | 'review';

export type VehicleInfo = {
  transport_mode: 'BODA' | 'BAJAI' | 'CAR' | 'VAN' | 'BUS';
  make: string;
  model: string;
  year: string;
  license_plate: string;
  capacity: string;
  color: string;
};

export type IdentityInfo = {
  full_name: string;
};

export type ContactInfo = {
  phone_number: string;
  email: string;
};

export type OnboardingDraft = {
  identity: IdentityInfo | null;
  contact: ContactInfo | null;
  vehicle: VehicleInfo | null;
  selectedCapabilities: ProviderCapability[];
  currentStep: OnboardingStep;
};