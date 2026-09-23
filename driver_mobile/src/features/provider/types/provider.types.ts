// src/features/provider/types/provider.types.ts

// ─── Provider Capability ─────────────────────────────────────────────
export type ProviderCapability =
  | 'PROFESSIONAL_SERVICE'
  | 'COMMUNITY_JOURNEY';

// ─── Capability Status ───────────────────────────────────────────────
export type CapabilityStatus =
  | 'NOT_ENABLED'
  | 'PENDING'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

// ─── Availability (Professional) ─────────────────────────────────────
export type ProfessionalAvailability =
  | 'OFFLINE'
  | 'ONLINE'
  | 'BUSY';

// ─── Availability (Community) ────────────────────────────────────────
export type CommunityAvailability =
  | 'NOT_SHARING'
  | 'SHARING'
  | 'JOURNEY_PUBLISHED'
  | 'MATCHING'
  | 'LIVE';

// ─── Verification Status ─────────────────────────────────────────────
export type VerificationStatus =
  | 'REGISTERED'
  | 'PENDING'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'DEACTIVATED';

// ─── Provider Profile ────────────────────────────────────────────────
export type ProviderProfile = {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string | null;
  email: string | null;
  verification_status: VerificationStatus;
  capabilities: ProviderCapability[];
  capability_status: Record<ProviderCapability, CapabilityStatus>;
  professional_availability: ProfessionalAvailability;
  community_availability: CommunityAvailability;
  rating: number | null;
  total_trips: number;
  created_at: string;
};
