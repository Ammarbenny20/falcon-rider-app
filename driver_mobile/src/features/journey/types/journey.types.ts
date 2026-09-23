// src/features/journey/types/journey.types.ts

export type JourneyStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type TransportMode = 'BODA' | 'BAJAI' | 'CAR' | 'VAN' | 'BUS';

export type JourneyPlace = {
  label: string;
  latitude: number;
  longitude: number;
};

export type JourneyRequest = {
  id: string;
  rider_name: string;
  rider_phone: string;
  origin_label: string;
  destination_label: string;
  seats_requested: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  created_at: string;
};

export type Journey = {
  id: string;
  origin: JourneyPlace;
  destination: JourneyPlace;
  departure_time: string;
  available_seats: number;
  total_seats: number;
  transport_mode: TransportMode;
  price_per_seat: number;
  currency: string;
  status: JourneyStatus;
  requests_count: number;
  created_at: string;
};

export type CreateJourneyPayload = {
  origin: JourneyPlace;
  destination: JourneyPlace;
  departure_time: string;
  available_seats: number;
  transport_mode: TransportMode;
  price_per_seat: number;
};