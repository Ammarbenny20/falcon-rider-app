/**
 * Falcon Rider Admin Portal — Provider Types
 *
 * IMPORTANT: Provider is broader than Driver.
 * A Provider may have Professional capability, Community capability, or both.
 * These are capabilities, NOT mutually exclusive user types.
 */

// ─────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────

export type ProviderAccountStatus =
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DEACTIVATED';

export type CapabilityType = 'PROFESSIONAL' | 'COMMUNITY';

export type CapabilityStatus =
  | 'NOT_REQUESTED'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type ProfessionalAvailability =
  | 'OFFLINE'
  | 'AVAILABLE'
  | 'BUSY'
  | 'PAUSED'
  | 'SUSPENDED';

export type VehicleType = 'BODA' | 'BODA_BODA' | 'CAR' | 'VAN' | 'BUS';

export type VehicleStatus =
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'REJECTED';

export type DocumentType =
  | 'IDENTITY'
  | 'LICENSE'
  | 'INSURANCE'
  | 'REGISTRATION'
  | 'INSPECTION'
  | 'PROFILE_PHOTO';

export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

// ─────────────────────────────────────────
// CORE ENTITIES
// ─────────────────────────────────────────

export interface Provider {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;

  accountStatus: ProviderAccountStatus;

  professionalCapability: CapabilityStatus;
  communityCapability: CapabilityStatus;

  professionalAvailability: ProfessionalAvailability;

  identityVerification: VerificationStatus;
  phoneVerification: VerificationStatus;

  rating?: number;
  totalTrips?: number;
  totalJourneys?: number;

  city?: string;
  country?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ProviderVehicle {
  id: string;
  providerId: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  plateNumber: string;
  color: string;
  capacity: number;
  year?: number;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderDocument {
  id: string;
  providerId: string;
  type: DocumentType;
  status: DocumentStatus;
  fileUrl: string;
  expiresAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationRecord {
  id: string;
  providerId: string;
  capability: CapabilityType;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reason?: string;
}

export interface ProviderEarnings {
  totalEarned: number;
  pendingPayout: number;
  lifetimePayouts: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
}

// ─────────────────────────────────────────
// PROVIDER 360 (detail view)
// ─────────────────────────────────────────

export interface Provider360 extends Provider {
  professionalVerification?: VerificationRecord;
  communityVerification?: VerificationRecord;
  vehicles: ProviderVehicle[];
  documents: ProviderDocument[];
  earnings?: ProviderEarnings;
}

// ─────────────────────────────────────────
// QUERY PARAMS
// ─────────────────────────────────────────

export interface ProviderListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  accountStatus?: ProviderAccountStatus;
  professionalCapability?: CapabilityStatus;
  communityCapability?: CapabilityStatus;
  professionalAvailability?: ProfessionalAvailability;
  city?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────

export interface ProviderVerificationAction {
  providerId: string;
  capability: CapabilityType;
  action: 'APPROVE' | 'REJECT';
  reason?: string;
}