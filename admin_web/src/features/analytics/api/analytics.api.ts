/**
 * Falcon Rider Admin Portal â€” Analytics API
 */

import { apiClient } from '@/lib/api/client';
import type {
  MarketplaceMetrics, MobilityMetrics, ProviderMetrics,
  CustomerMetrics, JourneyMetrics, FinanceMetrics, GeographyMetrics,
  AnalyticsParams,
} from '../types/analytics.types';

const USE_MOCK_DATA = true;

const MOCK_MARKETPLACE: MarketplaceMetrics = {
  periodStart: '2026-09-01T00:00:00Z',
  periodEnd: '2026-09-30T23:59:59Z',
  requests: 12480,
  matches: 11758,
  matchRate: 94.2,
  noMatchRate: 5.8,
  cancellationRate: 3.8,
  completionRate: 96.2,
  trips: 11320,
  bookings: 11890,
  gmv: { amount: 142500000, currency: 'TZS' },
  revenue: { amount: 28500000, currency: 'TZS' },
  providerEarnings: { amount: 102750000, currency: 'TZS' },
  platformFees: { amount: 28500000, currency: 'TZS' },
};

const MOCK_MOBILITY: MobilityMetrics = {
  tripsByStatus: [
    { status: 'COMPLETED', count: 10890 },
    { status: 'CANCELLED', count: 430 },
    { status: 'IN_PROGRESS', count: 47 },
  ],
  requestsByStatus: [
    { status: 'MATCHED', count: 11758 },
    { status: 'NO_MATCH', count: 722 },
  ],
  avgWaitMinutes: 4.2,
  avgTripDurationMinutes: 18.5,
  avgTripDistanceKm: 11.3,
};

const MOCK_PROVIDERS: ProviderMetrics = {
  totalProviders: 420,
  activeProviders: 183,
  byCapability: [
    { capability: 'PROFESSIONAL', count: 285 },
    { capability: 'COMMUNITY', count: 168 },
    { capability: 'BOTH', count: 95 },
  ],
  byAccountStatus: [
    { status: 'ACTIVE', count: 342 },
    { status: 'PENDING_VERIFICATION', count: 42 },
    { status: 'SUSPENDED', count: 24 },
    { status: 'DEACTIVATED', count: 12 },
  ],
  avgRating: 4.72,
  topCities: [
    { city: 'Dar es Salaam', count: 210 },
    { city: 'Arusha', count: 68 },
    { city: 'Mwanza', count: 52 },
    { city: 'Dodoma', count: 38 },
    { city: 'Mbeya', count: 32 },
  ],
};

const MOCK_CUSTOMERS: CustomerMetrics = {
  totalCustomers: 18420,
  activeCustomers: 8940,
  newCustomers: 1240,
  repeatRate: 62.4,
  avgTripsPerCustomer: 3.8,
};

const MOCK_JOURNEYS: JourneyMetrics = {
  totalJourneys: 1240,
  publishedJourneys: 1080,
  completedJourneys: 980,
  cancelledJourneys: 68,
  skippedJourneys: 32,
  totalSeats: 2860,
  bookedSeats: 1920,
  seatUtilization: 67.1,
};

const MOCK_FINANCE: FinanceMetrics = {
  periodStart: '2026-09-01T00:00:00Z',
  periodEnd: '2026-09-30T23:59:59Z',
  revenueByDay: Array.from({ length: 14 }).map((_, i) => ({
    date: `2026-09-${String(i + 7).padStart(2, '0')}`,
    amount: 1200000 + Math.floor(Math.random() * 800000),
  })),
  paymentsByMethod: [
    { method: 'MPESA', count: 7820, amount: 195500000 },
    { method: 'TIGO_PESA', count: 1840, amount: 46000000 },
    { method: 'AIRTEL_MONEY', count: 920, amount: 23000000 },
    { method: 'CASH', count: 1250, amount: 31250000 },
    { method: 'CARD', count: 60, amount: 1500000 },
  ],
  paymentsByStatus: [
    { status: 'SUCCESS', count: 11280 },
    { status: 'PENDING', count: 340 },
    { status: 'PENDING_CASH_CONFIRMATION', count: 220 },
    { status: 'FAILED', count: 420 },
    { status: 'REFUNDED', count: 220 },
  ],
  refundsTotal: { amount: 3150000, currency: 'TZS' },
  payoutsTotal: { amount: 98750000, currency: 'TZS' },
};

const MOCK_GEOGRAPHY: GeographyMetrics = {
  byCity: [
    { city: 'Dar es Salaam', trips: 7840, providers: 210, revenue: 195000000 },
    { city: 'Arusha', trips: 1420, providers: 68, revenue: 35500000 },
    { city: 'Mwanza', trips: 1080, providers: 52, revenue: 27000000 },
    { city: 'Dodoma', trips: 620, providers: 38, revenue: 15500000 },
    { city: 'Mbeya', trips: 360, providers: 32, revenue: 9000000 },
  ],
  byZone: [
    { zone: 'Kinondoni', trips: 3120 },
    { zone: 'Ilala', trips: 2840 },
    { zone: 'Temeke', trips: 1280 },
    { zone: 'Ubungo', trips: 600 },
  ],
};

function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

export const analyticsApi = {
  getMarketplace: async (_: AnalyticsParams = {}): Promise<MarketplaceMetrics> => {
    if (USE_MOCK_DATA) { await delay(400); return MOCK_MARKETPLACE; }
    const { data } = await apiClient.get('/admin/analytics/');
    return data;
  },
  getMobility: async (_: AnalyticsParams = {}): Promise<MobilityMetrics> => {
    if (USE_MOCK_DATA) { await delay(400); return MOCK_MOBILITY; }
    const { data } = await apiClient.get('/admin/analytics/trips/');
    return data;
  },
  getProviders: async (_: AnalyticsParams = {}): Promise<ProviderMetrics> => {
    if (USE_MOCK_DATA) { await delay(400); return MOCK_PROVIDERS; }
    const { data } = await apiClient.get('/admin/analytics/providers/');
    return data;
  },
  getCustomers: async (_: AnalyticsParams = {}): Promise<CustomerMetrics> => {
    if (USE_MOCK_DATA) { await delay(400); return MOCK_CUSTOMERS; }
    const { data } = await apiClient.get('/admin/analytics/customers/');
    return data;
  },
  getJourneys: async (_: AnalyticsParams = {}): Promise<JourneyMetrics> => {
    if (USE_MOCK_DATA) { await delay(400); return MOCK_JOURNEYS; }
    const { data } = await apiClient.get('/admin/analytics/journeys/');
    return data;
  },
  getFinance: async (_: AnalyticsParams = {}): Promise<FinanceMetrics> => {
    if (USE_MOCK_DATA) { await delay(400); return MOCK_FINANCE; }
    const { data } = await apiClient.get('/admin/analytics/revenue/');
    return data;
  },
  getGeography: async (_: AnalyticsParams = {}): Promise<GeographyMetrics> => {
    if (USE_MOCK_DATA) { await delay(400); return MOCK_GEOGRAPHY; }
    const { data } = await apiClient.get('/admin/analytics/geography/');
    return data;
  },
};


