// src/features/journey/services/journeyTemplate.mock.ts

import type {
  CreateJourneyTemplatePayload,
  JourneyTemplate,
} from '@/features/journey/types/journeyTemplate.types';

const MOCK_TEMPLATES: JourneyTemplate[] = [];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const journeyTemplateMock = {
  async create(
    payload: CreateJourneyTemplatePayload,
  ): Promise<JourneyTemplate> {
    await delay(500);
    const template: JourneyTemplate = {
      id: `mock-template-${Date.now()}`,
      name: payload.name,
      origin: payload.origin,
      destination: payload.destination,
      days_of_week: payload.days_of_week,
      departure_time: payload.departure_time,
      total_seats: payload.total_seats,
      transport_mode: payload.transport_mode,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    MOCK_TEMPLATES.unshift(template);
    return template;
  },

  async list(): Promise<JourneyTemplate[]> {
    await delay(300);
    return [...MOCK_TEMPLATES];
  },

  async remove(id: string): Promise<void> {
    await delay(300);
    const index = MOCK_TEMPLATES.findIndex((t) => t.id === id);
    if (index >= 0) MOCK_TEMPLATES.splice(index, 1);
  },
};