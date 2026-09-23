// src/features/journey/services/journey.mock.ts

import type {
  CreateJourneyPayload,
  Journey,
} from '@/features/journey/types/journey.types';

const MOCK_JOURNEYS: Journey[] = [];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const journeyMock = {
  async create(payload: CreateJourneyPayload): Promise<Journey> {
    await delay(500);

    // MOCK ONLY: In production, the backend calculates cost_share
    // based on distance, fuel, and number of passengers.
    const mockCostShare = 5000;

    const journey: Journey = {
      id: `mock-journey-${Date.now()}`,
      origin: payload.origin,
      destination: payload.destination,
      departure_time: payload.departure_time,
      available_seats: payload.available_seats,
      total_seats: payload.available_seats,
      transport_mode: payload.transport_mode,
      price_per_seat: mockCostShare, // Backend-calculated
      currency: 'TZS',
      status: 'PUBLISHED',
      requests_count: 0,
      created_at: new Date().toISOString(),
    };
    MOCK_JOURNEYS.unshift(journey);
    return journey;
  },

  async list(): Promise<Journey[]> {
    await delay(300);
    return [...MOCK_JOURNEYS];
  },

  async get(id: string): Promise<Journey> {
    await delay(200);
    const found = MOCK_JOURNEYS.find((j) => j.id === id);
    if (!found) throw new Error('Journey not found');
    return found;
  },

  async cancel(id: string): Promise<Journey> {
    await delay(300);
    const found = MOCK_JOURNEYS.find((j) => j.id === id);
    if (!found) throw new Error('Journey not found');
    found.status = 'CANCELLED';
    return found;
  },
};