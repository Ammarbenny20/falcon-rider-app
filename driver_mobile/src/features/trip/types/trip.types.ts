// src/features/trip/types/trip.types.ts

export type TripStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Trip = {
  id: string;
  journey_id: string;
  rider_name: string;
  origin_label: string;
  destination_label: string;
  status: TripStatus;
  fare_amount: number;
  currency: string;
  started_at: string;
  completed_at: string | null;
};