// src/store/ride-draft.store.ts

import { create } from 'zustand';

import type { PlaceSelection } from '@/features/places/types/place.types';
import type {
  BookingType,
  RideAccessType,
  TransportMode,
} from '@/features/rider-requests/types/riderRequest.types';

type RideDraftState = {
  // Route
  pickup: PlaceSelection | null;
  destination: PlaceSelection | null;

  // When
  bookingType: BookingType;       // NOW | SCHEDULED
  scheduledFor: string | null;     // ISO timestamp (only if SCHEDULED)

  // Ride configuration
  rideAccessType: RideAccessType;  // PRIVATE | SHARED
  transportMode: TransportMode | null;
  seatsNeeded: number;

  // Actions
  setPickup: (place: PlaceSelection | null) => void;
  setDestination: (place: PlaceSelection | null) => void;
  setBookingType: (type: BookingType) => void;
  setScheduledFor: (iso: string | null) => void;
  setRideAccessType: (type: RideAccessType) => void;
  setTransportMode: (mode: TransportMode | null) => void;
  setSeatsNeeded: (n: number) => void;
  reset: () => void;
};

const initialState = {
  pickup: null,
  destination: null,
  bookingType: 'NOW' as BookingType,
  scheduledFor: null,
  rideAccessType: 'SHARED' as RideAccessType,
  transportMode: null,
  seatsNeeded: 1,
};

export const useRideDraftStore = create<RideDraftState>((set) => ({
  ...initialState,
  setPickup: (pickup) => set({ pickup }),
  setDestination: (destination) => set({ destination }),
  setBookingType: (bookingType) => set({ bookingType }),
  setScheduledFor: (scheduledFor) => set({ scheduledFor }),
  setRideAccessType: (rideAccessType) =>
    set((state) => ({
      rideAccessType,
      // Reset transport mode if not eligible
      transportMode: isEligible(state.transportMode, rideAccessType)
        ? state.transportMode
        : null,
    })),
  setTransportMode: (transportMode) => set({ transportMode }),
  setSeatsNeeded: (seatsNeeded) => set({ seatsNeeded }),
  reset: () => set(initialState),
}));

/**
 * Whether a transport mode is eligible for the given ride access type.
 * SHARED: BODA is not eligible (boda cannot be shared).
 * PRIVATE: all modes eligible.
 */
function isEligible(
  mode: TransportMode | null,
  accessType: RideAccessType,
): boolean {
  if (!mode) return false;
  if (accessType === 'SHARED') return mode !== 'BODA';
  return true;
}