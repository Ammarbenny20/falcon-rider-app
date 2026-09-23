// src/features/journeys/types/journey.types.ts

export type JourneyStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ABORTED'
  | 'CANCELLED';

export type BookingType = 'SHARED' | 'WHOLE_VEHICLE';

export type Journey = {
  id: string;
  origin_label: string;
  destination_label: string;
  scheduled_for: string | null;
  booking_type: BookingType;
  status: JourneyStatus;
  fare_amount: number | null;
  currency: string;
  created_at: string;
};