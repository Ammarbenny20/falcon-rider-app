/**
 * Falcon Rider Admin Portal — Provider Types
 *
 * IMPORTANT: Provider is broader than Driver.
 * A Provider may have:
 *   - Professional capability only
 *   - Community capability only
 *   - Both
 *
 * These are capabilities, NOT mutually exclusive user types.
 */

import type { BaseEntity, Location, Money } from './common.types';

// ─────────────────────────────────────────
// PROVIDER ACCOUNT
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

// ─────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────

export interface Provider extends BaseEntity {
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

// ─────────────────────────────────────────
// PROVIDER DETAIL (360 view)
// ─────────────────────────────────────────

export interface ProviderDetail extends Provider {
  professionalVerification?: VerificationRecord;
  communityVerification?: VerificationRecord;
  vehicles: ProviderVehicle[];
  documents: ProviderDocument[];
  recentTrips?: TripSummary[];
  recentJourneys?: JourneySummary[];
  earnings?: ProviderEarnings;
  safetyFlags?: SafetyFlag[];
  supportCases?: SupportCaseSummary[];
}

// ─────────────────────────────────────────
// VEHICLE
// ─────────────────────────────────────────

export type VehicleType = 'BODA' | 'BODA_BODA' | 'CAR' | 'VAN' | 'BUS';

export type VehicleStatus =
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'REJECTED';

export interface ProviderVehicle extends BaseEntity {
  providerId: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  plateNumber: string;
  color: string;
  capacity: number;
  year?: number;
  status: VehicleStatus;
}

// ─────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────

export type DocumentType =
  | 'IDENTITY'
  | 'LICENSE'
  | 'INSURANCE'
  | 'REGISTRATION'
  | 'INSPECTION'
  | 'PROFILE_PHOTO';

export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface ProviderDocument extends BaseEntity {
  providerId: string;
  type: DocumentType;
  status: DocumentStatus;
  fileUrl: string;
  expiresAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// ─────────────────────────────────────────
// VERIFICATION
// ─────────────────────────────────────────

export interface VerificationRecord extends BaseEntity {
  providerId: string;
  capability: CapabilityType;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reason?: string;
}

// ─────────────────────────────────────────
// EARNINGS
// ─────────────────────────────────────────

export interface ProviderEarnings {
  totalEarned: Money;
  pendingPayout: Money;
  lifetimePayouts: Money;
  periodStart: string;
  periodEnd: string;
}

// ─────────────────────────────────────────
// FORWARD REFERENCES (defined in other files)
// ─────────────────────────────────────────

export interface TripSummary {
  id: string;
  status: string;
  completedAt?: string;
  fare?: Money;
}

export interface JourneySummary {
  id: string;
  origin: Location;
  destination: Location;
  departureTime: string;
  status: string;
}

export interface SafetyFlag {
  id: string;
  type: string;
  severity: string;
  createdAt: string;
}

export interface SupportCaseSummary {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
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
  city?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}