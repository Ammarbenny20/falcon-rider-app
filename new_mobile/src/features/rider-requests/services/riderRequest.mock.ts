// src/features/rider-requests/services/riderRequest.mock.ts

import type {
  CreateRiderRequestPayload,
  RiderRequest,
} from '@/features/rider-requests/types/riderRequest.types';

/**
 * In-memory mock storage for rider requests during development.
 */
const MOCK_REQUESTS: RiderRequest[] = [];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const riderRequestMock = {
  async create(payload: CreateRiderRequestPayload): Promise<RiderRequest> {
    await delay(500);

    const request: RiderRequest = {
      id: `mock-req-${Date.now()}`,
      passenger_id: 'mock-user',
      origin: payload.origin,
      destination: payload.destination,
      requested_time: payload.requested_time,
      scheduled_for: payload.scheduled_for ?? null,
      is_scheduled: payload.is_scheduled,
      seats_needed: payload.seats_needed,
      booking_type: payload.booking_type,
      ride_access_type: payload.ride_access_type,
      transport_mode: payload.transport_mode,
      status: payload.is_scheduled ? 'SCHEDULED' : 'SUBMITTED',
      created_at: new Date().toISOString(),
    };

    MOCK_REQUESTS.unshift(request);
    return request;
  },

  async get(id: string): Promise<RiderRequest> {
    await delay(200);
    const found = MOCK_REQUESTS.find((r) => r.id === id);
    if (!found) throw new Error('Request not found');
    return found;
  },

  async list(): Promise<RiderRequest[]> {
    await delay(200);
    return [...MOCK_REQUESTS];
  },

  async cancel(id: string): Promise<RiderRequest> {
    await delay(300);
    const found = MOCK_REQUESTS.find((r) => r.id === id);
    if (!found) throw new Error('Request not found');
    found.status = 'CANCELLED';
    return found;
  },
};