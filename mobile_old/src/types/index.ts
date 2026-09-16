export type UserRole = "PASSENGER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  phone_number: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export type TransportType = "BODA_BODA" | "BAJAJI" | "CAR" | "BUS";

export type JourneyStatus =
  | "SEARCHING"
  | "MATCHING"
  | "CONFIRMED"
  | "PROVIDER_ARRIVING"
  | "PROVIDER_ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Journey {
  id: string;
  passenger: string;
  provider: string | null;
  vehicle: string | null;
  transport_type: TransportType;
  status: JourneyStatus;
  origin_lat: string;
  origin_lng: string;
  origin_label: string;
  destination_lat: string;
  destination_lng: string;
  destination_label: string;
  distance_meters: number | null;
  pickup_eta_seconds: number | null;
  travel_time_min_seconds: number | null;
  travel_time_max_seconds: number | null;
  estimated_arrival_at: string | null;
  fare_amount: string | null;
  platform_fee_amount: string | null;
  provider_earning_amount: string | null;
  payment_status: string;
  is_scheduled: boolean;
  scheduled_for: string | null;
  requested_at: string;
  accepted_at: string | null;
  arrived_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string;
}

export type ProviderType =
  | "INDIVIDUAL_PROVIDER"
  | "FLEET_OWNER"
  | "TRANSPORT_OPERATOR"
  | "BUS_OPERATOR"
  | "SHUTTLE_OPERATOR";

export type VerificationStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "CORRECTION_REQUIRED"
  | "RESUBMITTED"
  | "APPROVED"
  | "REJECTED";

export interface Provider {
  id: string;
  user: string;
  provider_type: ProviderType;
  status: "ACTIVE" | "SUSPENDED" | "REACTIVATED";
  is_online: boolean;
  current_lat: string | null;
  current_lng: string | null;
  is_location_simulated: boolean;
}

export interface ProviderVerification {
  id: string;
  provider: string;
  status: VerificationStatus;
  documents: Record<string, unknown>;
  correction_notes: string;
  submitted_at: string | null;
  reviewed_at: string | null;
}

export type VehicleStatus = "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";

export interface Vehicle {
  id: string;
  provider: string;
  vehicle_type: TransportType | "SHUTTLE";
  plate_number: string;
  make: string;
  model: string;
  capacity: number;
  status: VehicleStatus;
  verification_status: VerificationStatus;
  is_primary: boolean;
}

export interface Payment {
  id: string;
  journey: string;
  fare_amount: string;
  platform_fee_amount: string;
  provider_earning_amount: string;
  method: "CASH" | "MOBILE_MONEY" | "CARD";
  status: "PENDING" | "SUCCESSFUL" | "FAILED" | "REFUNDED";
  created_at: string;
}

export type BusBookingStatus =
  | "REQUESTED" | "REVIEWING" | "BUS_ASSIGNED" | "CONFIRMED"
  | "READY_FOR_DEPARTURE" | "VEHICLE_ARRIVING" | "IN_PROGRESS"
  | "COMPLETED" | "CANCELLED" | "NEEDS_ACTION";

export interface BusBooking {
  id: string;
  organizer: string;
  contact_phone: string;
  pickup_label: string;
  destination_label: string;
  travel_date: string;
  departure_window_start: string;
  departure_window_end: string;
  passenger_count: number;
  status: BusBookingStatus;
  estimated_fare: string | null;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: string;
  is_read: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_CUSTOMER" | "RESOLVED" | "CLOSED";
  created_at: string;
}

export interface SafetyIncident {
  id: string;
  journey: string;
  category: string;
  description: string;
  status: "REPORTED" | "INVESTIGATING" | "ACTION_TAKEN" | "RESOLVED";
}

export interface TransportOption {
  transport_type: TransportType;
  pickup_eta_seconds: number;
  travel_time_min_seconds: number;
  travel_time_max_seconds: number;
  estimated_arrival_at: string;
  fare_amount: number;
  availability: "AVAILABLE" | "LIMITED" | "NEARLY_FULL" | "FULL" | "BUSY" | "UNAVAILABLE";
  seats_remaining?: number;
  seats_total?: number;
}

export interface ApiError {
  detail: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}