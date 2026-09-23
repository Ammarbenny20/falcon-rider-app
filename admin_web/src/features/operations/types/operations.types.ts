/**
 * Falcon Rider Admin Portal — Operations Types
 */

import type { Money, Coordinates } from '@/types/common.types';

// ─────────────────────────────────────────
// REQUESTS
// ─────────────────────────────────────────

export type RequestStatus =
  | 'REQUESTED'
  | 'SEARCHING'
  | 'MATCHED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'NO_MATCH';

export type BookingType = 'NOW' | 'SCHEDULED';
export type RideAccessType = 'PRIVATE' | 'SHARED' | 'WHOLE_VEHICLE';
export type TransportMode = 'BODA' | 'CAR' | 'VAN' | 'BUS';

export interface RideRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  originAddress: string;
  originCoords: Coordinates;
  destinationAddress: string;
  destinationCoords: Coordinates;
  bookingType: BookingType;
  rideAccessType: RideAccessType;
  transportMode: TransportMode;
  passengerCount: number;
  scheduledFor?: string;
  status: RequestStatus;
  providerId?: string;
  providerName?: string;
  fareEstimate?: Money;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  cancelledReason?: string;
}

export interface RequestListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: RequestStatus;
  bookingType?: BookingType;
  rideAccessType?: RideAccessType;
  transportMode?: TransportMode;
  dateFrom?: string;
  dateTo?: string;
}

// ─────────────────────────────────────────
// MATCHING
// ─────────────────────────────────────────

export interface MatchingCandidate {
  providerId: string;
  providerName: string;
  distance: number;
  eta: number;
  rating?: number;
  vehicleType: TransportMode;
  capacity: number;
  accepted: boolean;
  rejectedReason?: string;
}

export interface MatchingSession {
  id: string;
  requestId: string;
  status: 'SEARCHING' | 'MATCHED' | 'FAILED';
  candidates: MatchingCandidate[];
  matchedProviderId?: string;
  startedAt: string;
  completedAt?: string;
  attemptCount: number;
}

// ─────────────────────────────────────────
// TRIPS
// ─────────────────────────────────────────

export type TripStatus =
  | 'SCHEDULED'
  | 'REQUESTED'
  | 'SEARCHING'
  | 'MATCHED'
  | 'PROVIDER_EN_ROUTE'
  | 'PROVIDER_ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ABORTED'
  | 'DELAYED'
  | 'NO_MATCH';

export interface Trip {
  id: string;
  requestId: string;
  bookingId?: string;
  customerId: string;
  customerName: string;
  providerId?: string;
  providerName?: string;
  vehicleId?: string;
  vehiclePlate?: string;

  originAddress: string;
  originCoords: Coordinates;
  destinationAddress: string;
  destinationCoords: Coordinates;

  bookingType: BookingType;
  rideAccessType: RideAccessType;

  status: TripStatus;
  fare: Money;

  scheduledStart?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;

  distanceKm?: number;
  durationMinutes?: number;

  createdAt: string;
  updatedAt: string;
}

export interface TripListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TripStatus;
  bookingType?: BookingType;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Booking {
  id: string;
  tripId?: string;
  requestId: string;
  customerId: string;
  customerName: string;
  providerId?: string;
  providerName?: string;
  seats: number;
  fare: Money;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledReason?: string;
}

export interface BookingListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
}

// ─────────────────────────────────────────
// SCHEDULED
// ─────────────────────────────────────────

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskReason =
  | 'PROVIDER_NOT_ASSIGNED'
  | 'PROVIDER_NOT_AVAILABLE'
  | 'VERIFICATION_PROBLEM'
  | 'PAYMENT_PROBLEM'
  | 'CUSTOMER_CANCELLATION'
  | 'CAPACITY_PROBLEM'
  | 'NOTIFICATION_FAILURE';

export interface ScheduledTrip {
  id: string;
  tripId: string;
  customerName: string;
  originAddress: string;
  destinationAddress: string;
  scheduledFor: string;
  providerAssigned: boolean;
  providerName?: string;
  riskLevel: RiskLevel;
  riskReasons: RiskReason[];
  minutesUntil: number;
}

// ─────────────────────────────────────────
// COMMUNITY JOURNEYS
// ─────────────────────────────────────────

export type JourneyStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'MATCHING'
  | 'CONFIRMED'
  | 'LIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'SKIPPED'
  | 'EXPIRED';

export interface CommunityJourney {
  id: string;
  providerId: string;
  providerName: string;
  originAddress: string;
  originCoords: Coordinates;
  destinationAddress: string;
  destinationCoords: Coordinates;
  departureAt: string;
  seatsAvailable: number;
  seatsBooked: number;
  vehicleType: TransportMode;
  vehiclePlate: string;
  costPerSeat: Money;
  status: JourneyStatus;
  isRecurring: boolean;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyTemplate {
  id: string;
  providerId: string;
  providerName: string;
  name: string;
  originAddress: string;
  destinationAddress: string;
  recurrenceDays: string[];
  departureTime: string;
  seatsAvailable: number;
  costPerSeat: Money;
  isActive: boolean;
  createdAt: string;
}

export interface JourneyListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: JourneyStatus;
  isRecurring?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// ─────────────────────────────────────────
// PROVIDER AVAILABILITY
// ─────────────────────────────────────────

export type ProfessionalAvailability =
  | 'OFFLINE'
  | 'AVAILABLE'
  | 'BUSY'
  | 'PAUSED'
  | 'SUSPENDED';

export interface ProviderAvailability {
  id: string;
  providerId: string;
  providerName: string;
  capability: 'PROFESSIONAL' | 'COMMUNITY';
  availability?: ProfessionalAvailability;
  journeyStatus?: JourneyStatus;
  city: string;
  lastSeenAt: string;
  activeTripId?: string;
}

export interface AvailabilityListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  capability?: 'PROFESSIONAL' | 'COMMUNITY';
  availability?: ProfessionalAvailability;
  city?: string;
}

// ─────────────────────────────────────────
// EXCEPTIONS
// ─────────────────────────────────────────

export type ExceptionType =
  | 'REQUEST_NO_MATCH'
  | 'SCHEDULED_TRIP_NO_PROVIDER'
  | 'PROVIDER_NO_SHOW'
  | 'CUSTOMER_NO_SHOW'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_DISPUTED'
  | 'REFUND_PENDING'
  | 'PAYOUT_FAILED'
  | 'VERIFICATION_EXPIRED'
  | 'VERIFICATION_REJECTED'
  | 'SAFETY_INCIDENT'
  | 'TRIP_DELAYED'
  | 'NOTIFICATION_FAILED'
  | 'SYSTEM_ERROR';

export type ExceptionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Exception {
  id: string;
  type: ExceptionType;
  priority: ExceptionPriority;
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface ExceptionListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: ExceptionType;
  priority?: ExceptionPriority;
  status?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

// ─────────────────────────────────────────
// LIVE OPERATIONS
// ─────────────────────────────────────────

export interface LiveOperationsData {
  activeTrips: number;
  providersOnline: number;
  providersAvailable: number;
  requestsSearching: number;
  requestsMatched: number;
  activeJourneys: number;
  availableSeats: number;
  scheduledApproaching: number;
}