// src/features/rider-requests/utils/ride-state.ts

import type { RiderRequestStatus } from '@/features/rider-requests/types/riderRequest.types';

/**
 * The "phase" of a ride, derived from status.
 * Used to decide UI copy, colors, and available actions.
 */
export type RidePhase = 'pending' | 'active' | 'done' | 'failed';

export function phaseFor(status: RiderRequestStatus): RidePhase {
  switch (status) {
    case 'DRAFT':
    case 'SUBMITTED':
    case 'SCHEDULED':
    case 'AWAITING_CONFIRMATION':
    case 'CONFIRMED':
    case 'MATCHING':
    case 'MATCHED':
    case 'BOOKED':
      return 'pending';
    case 'FULFILLED':
      return 'done';
    case 'NO_MATCH_FOUND':
    case 'CANCELLED':
    case 'EXPIRED':
      return 'failed';
  }
}

/**
 * Human-readable label (English) for a status.
 * NOTE: This will be replaced by i18n keys in a later phase.
 */
export function labelForStatus(status: RiderRequestStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'Draft';
    case 'SUBMITTED':
      return 'Submitted';
    case 'SCHEDULED':
      return 'Scheduled';
    case 'AWAITING_CONFIRMATION':
      return 'Awaiting confirmation';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'MATCHING':
      return 'Matching';
    case 'MATCHED':
      return 'Driver found';
    case 'BOOKED':
      return 'Booked';
    case 'FULFILLED':
      return 'Completed';
    case 'NO_MATCH_FOUND':
      return 'No match found';
    case 'CANCELLED':
      return 'Cancelled';
    case 'EXPIRED':
      return 'Expired';
  }
}

/**
 * Whether the ride can be cancelled by the customer.
 */
export function canCancel(status: RiderRequestStatus): boolean {
  switch (status) {
    case 'DRAFT':
    case 'SUBMITTED':
    case 'SCHEDULED':
    case 'AWAITING_CONFIRMATION':
    case 'CONFIRMED':
    case 'MATCHING':
    case 'MATCHED':
    case 'BOOKED':
      return true;
    default:
      return false;
  }
}

/**
 * Whether the ride can be rescheduled by the customer.
 */
export function canReschedule(status: RiderRequestStatus): boolean {
  return (
    status === 'SCHEDULED' ||
    status === 'AWAITING_CONFIRMATION' ||
    status === 'CONFIRMED'
  );
}

/**
 * Whether the ride needs the customer's confirmation right now.
 */
export function needsConfirmation(status: RiderRequestStatus): boolean {
  return status === 'AWAITING_CONFIRMATION';
}