// src/features/journey/types/journeyTemplate.types.ts

import type { JourneyPlace, TransportMode } from '@/features/journey/types/journey.types';

export type JourneyTemplateDay = 1 | 2 | 3 | 4 | 5 | 6 | 7; // Mon=1 .. Sun=7

export type JourneyTemplate = {
  id: string;
  name: string;
  origin: JourneyPlace;
  destination: JourneyPlace;
  days_of_week: JourneyTemplateDay[];
  departure_time: string; // "07:30"
  total_seats: number;
  transport_mode: TransportMode;
  is_active: boolean;
  created_at: string;
};

export type CreateJourneyTemplatePayload = {
  name: string;
  origin: JourneyPlace;
  destination: JourneyPlace;
  days_of_week: JourneyTemplateDay[];
  departure_time: string;
  total_seats: number;
  transport_mode: TransportMode;
};

export const DAY_LABELS: Record<JourneyTemplateDay, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};