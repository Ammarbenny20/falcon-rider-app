// src/features/rider-requests/types/riderRequest.types.ts

// ─── Booking Type (WHEN) ─────────────────────────────────────────────
export type BookingType = 'NOW' | 'SCHEDULED';

// ─── Ride Access Type (WHO) ──────────────────────────────────────────
export type RideAccessType = 'PRIVATE' | 'SHARED';

// ─── Transport Mode (WHAT VEHICLE) ───────────────────────────────────
export type TransportMode = 'BODA' | 'BAJAI' | 'CAR' | 'VAN' | 'BUS';

// ─── Ride Request Status (state machine) ─────────────────────────────
export type RiderRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'SCHEDULED'
  | 'AWAITING_CONFIRMATION'
  | 'CONFIRMED'
  | 'MATCHING'
  | 'MATCHED'
  | 'BOOKED'
  | 'FULFILLED'
  | 'NO_MATCH_FOUND'
  | 'CANCELLED'
  | 'EXPIRED';

// ─── API Shapes ──────────────────────────────────────────────────────
export type RiderRequestPlace = {
  latitude: number;
  longitude: number;
  label: string;
};

export type RiderRequest = {
  id: string;
  passenger_id: string;
  origin: RiderRequestPlace;
  destination: RiderRequestPlace;
  requested_time: string;
  scheduled_for: string | null;
  is_scheduled: boolean;
  seats_needed: number;
  booking_type: BookingType;
  ride_access_type: RideAccessType;
  transport_mode: TransportMode;
  status: RiderRequestStatus;
  created_at: string;
};

export type CreateRiderRequestPayload = {
  origin: RiderRequestPlace;
  destination: RiderRequestPlace;
  requested_time: string;
  scheduled_for?: string | null;
  is_scheduled: boolean;
  seats_needed: number;
  booking_type: BookingType;
  ride_access_type: RideAccessType;
  transport_mode: TransportMode;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};