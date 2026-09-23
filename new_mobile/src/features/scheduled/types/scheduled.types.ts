// src/features/scheduled/types/scheduled.types.ts

import type { RiderRequest } from '@/features/rider-requests/types/riderRequest.types';

/**
 * A scheduled ride that is pending confirmation or confirmed.
 * Currently just a typed alias for RiderRequest, but kept separate so
 * we can add scheduled-specific fields later without breaking things.
 */
export type ScheduledRide = RiderRequest;

/**
 * The "phase" of a scheduled ride — derived from status + time.
 * Used to decide which CTA to show.
 */
export type ScheduledPhase =
  | 'upcoming'          // scheduled, not yet due
  | 'awaiting_action'   // needs confirmation soon
  | 'active'            // confirmed, matching/trip in progress
  | 'expired'           // missed the confirmation deadline
  | 'cancelled';