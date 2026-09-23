/**
 * Falcon Rider Admin Portal â€” Operations API
 *
 * Mock data for now. Switch to real endpoints when backend is ready.
 */

import { apiClient } from '@/lib/api/client';
import type {
  RideRequest, RequestListParams,
  Trip, TripListParams,
  Booking, BookingListParams,
  ScheduledTrip,
  CommunityJourney, JourneyTemplate, JourneyListParams,
  ProviderAvailability, AvailabilityListParams,
  Exception, ExceptionListParams,
  LiveOperationsData,
  MatchingSession,
} from '../types/operations.types';

const USE_MOCK_DATA = true;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CUSTOMER DETAIL TYPE (kwa Customer 360)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface CustomerDetail {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  identityVerification: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
  phoneVerification: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
  totalTrips: number;
  totalSpent: { amount: number; currency: string };
  rating?: number;
  city?: string;
  joinedAt: string;
  lastActiveAt: string;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HELPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function paginate<T>(items: T[], page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize;
  return {
    results: items.slice(start, start + pageSize),
    totalItems: items.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function now(offsetMinutes = 0): string {
  return new Date(Date.now() + offsetMinutes * 60000).toISOString();
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_LIVE: LiveOperationsData = {
  activeTrips: 47,
  providersOnline: 183,
  providersAvailable: 92,
  requestsSearching: 8,
  requestsMatched: 39,
  activeJourneys: 14,
  availableSeats: 31,
  scheduledApproaching: 12,
};

const MOCK_REQUESTS: RideRequest[] = [
  {
    id: 'RQ-10847',
    customerId: 'CU-00082',
    customerName: 'John Mwangi',
    customerPhone: '+255712345678',
    originAddress: 'Posta, Dar es Salaam',
    originCoords: { lat: -6.8160, lng: 39.2890 },
    destinationAddress: 'Mwenge, Dar es Salaam',
    destinationCoords: { lat: -6.7700, lng: 39.2400 },
    bookingType: 'NOW',
    rideAccessType: 'PRIVATE',
    transportMode: 'BODA',
    passengerCount: 1,
    status: 'SEARCHING',
    fareEstimate: { amount: 6500, currency: 'TZS' },
    createdAt: now(-3),
    updatedAt: now(-3),
    expiresAt: now(27),
  },
  {
    id: 'RQ-10846',
    customerId: 'CU-00091',
    customerName: 'David Kimaro',
    customerPhone: '+255723456789',
    originAddress: 'Mbezi Beach',
    originCoords: { lat: -6.7500, lng: 39.2600 },
    destinationAddress: 'Kariakoo',
    destinationCoords: { lat: -6.8180, lng: 39.2780 },
    bookingType: 'NOW',
    rideAccessType: 'PRIVATE',
    transportMode: 'CAR',
    passengerCount: 2,
    status: 'MATCHED',
    providerId: 'PR-00001',
    providerName: 'Juma Mwakalinga',
    fareEstimate: { amount: 12500, currency: 'TZS' },
    createdAt: now(-6),
    updatedAt: now(-4),
  },
  {
    id: 'RQ-10845',
    customerId: 'CU-00067',
    customerName: 'Neema Joseph',
    customerPhone: '+255734567890',
    originAddress: 'Kinondoni',
    originCoords: { lat: -6.7930, lng: 39.2600 },
    destinationAddress: 'Ubungo',
    destinationCoords: { lat: -6.7860, lng: 39.2200 },
    bookingType: 'SCHEDULED',
    rideAccessType: 'SHARED',
    transportMode: 'CAR',
    passengerCount: 1,
    scheduledFor: now(45),
    status: 'MATCHED',
    providerId: 'PR-00006',
    providerName: 'Grace Mushi',
    fareEstimate: { amount: 4500, currency: 'TZS' },
    createdAt: now(-15),
    updatedAt: now(-10),
  },
  {
    id: 'RQ-10844',
    customerId: 'CU-00012',
    customerName: 'Fatuma Ali',
    customerPhone: '+255745678901',
    originAddress: 'Tabata',
    originCoords: { lat: -6.8300, lng: 39.2300 },
    destinationAddress: 'Airport',
    destinationCoords: { lat: -6.8780, lng: 39.2027 },
    bookingType: 'SCHEDULED',
    rideAccessType: 'PRIVATE',
    transportMode: 'CAR',
    passengerCount: 3,
    scheduledFor: now(180),
    status: 'REQUESTED',
    fareEstimate: { amount: 25000, currency: 'TZS' },
    createdAt: now(-20),
    updatedAt: now(-20),
  },
];

const MOCK_TRIPS: Trip[] = [
  {
    id: 'TR-10482',
    requestId: 'RQ-10842',
    customerId: 'CU-00082',
    customerName: 'John Mwangi',
    providerId: 'PR-00001',
    providerName: 'Juma Mwakalinga',
    vehiclePlate: 'MC 123 ABC',
    originAddress: 'Mbezi Beach',
    originCoords: { lat: -6.7500, lng: 39.2600 },
    destinationAddress: 'Kariakoo',
    destinationCoords: { lat: -6.8180, lng: 39.2780 },
    bookingType: 'NOW',
    rideAccessType: 'PRIVATE',
    status: 'COMPLETED',
    fare: { amount: 12500, currency: 'TZS' },
    startedAt: now(-40),
    completedAt: now(-5),
    distanceKm: 14.2,
    durationMinutes: 35,
    createdAt: now(-45),
    updatedAt: now(-5),
  },
  {
    id: 'TR-10481',
    requestId: 'RQ-10841',
    customerId: 'CU-00045',
    customerName: 'Amina Said',
    providerId: 'PR-00006',
    providerName: 'Grace Mushi',
    vehiclePlate: 'T 456 XYZ',
    originAddress: 'Posta',
    originCoords: { lat: -6.8160, lng: 39.2890 },
    destinationAddress: 'Mwenge',
    destinationCoords: { lat: -6.7700, lng: 39.2400 },
    bookingType: 'NOW',
    rideAccessType: 'PRIVATE',
    status: 'IN_PROGRESS',
    fare: { amount: 8700, currency: 'TZS' },
    startedAt: now(-12),
    distanceKm: 9.8,
    createdAt: now(-18),
    updatedAt: now(-12),
  },
  {
    id: 'TR-10480',
    requestId: 'RQ-10840',
    customerId: 'CU-00034',
    customerName: 'Halima Mwinyi',
    providerId: 'PR-00003',
    providerName: 'Baraka Nyerere',
    vehiclePlate: 'T 789 ABC',
    originAddress: 'Kinondoni',
    originCoords: { lat: -6.7930, lng: 39.2600 },
    destinationAddress: 'Kariakoo',
    destinationCoords: { lat: -6.8180, lng: 39.2780 },
    bookingType: 'NOW',
    rideAccessType: 'SHARED',
    status: 'PROVIDER_EN_ROUTE',
    fare: { amount: 5200, currency: 'TZS' },
    distanceKm: 7.1,
    createdAt: now(-8),
    updatedAt: now(-3),
  },
  {
    id: 'TR-10479',
    requestId: 'RQ-10839',
    customerId: 'CU-00091',
    customerName: 'David Kimaro',
    originAddress: 'Tabata',
    originCoords: { lat: -6.8300, lng: 39.2300 },
    destinationAddress: 'Airport',
    destinationCoords: { lat: -6.8780, lng: 39.2027 },
    bookingType: 'SCHEDULED',
    rideAccessType: 'PRIVATE',
    status: 'SCHEDULED',
    fare: { amount: 25000, currency: 'TZS' },
    scheduledStart: now(120),
    createdAt: now(-60),
    updatedAt: now(-60),
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-20145',
    tripId: 'TR-10482',
    requestId: 'RQ-10842',
    customerId: 'CU-00082',
    customerName: 'John Mwangi',
    providerId: 'PR-00001',
    providerName: 'Juma Mwakalinga',
    seats: 1,
    fare: { amount: 12500, currency: 'TZS' },
    status: 'COMPLETED',
    createdAt: now(-45),
    updatedAt: now(-5),
  },
  {
    id: 'BK-20144',
    tripId: 'TR-10481',
    requestId: 'RQ-10841',
    customerId: 'CU-00045',
    customerName: 'Amina Said',
    providerId: 'PR-00006',
    providerName: 'Grace Mushi',
    seats: 1,
    fare: { amount: 8700, currency: 'TZS' },
    status: 'IN_PROGRESS',
    createdAt: now(-18),
    updatedAt: now(-12),
  },
  {
    id: 'BK-20143',
    tripId: 'TR-10480',
    requestId: 'RQ-10840',
    customerId: 'CU-00034',
    customerName: 'Halima Mwinyi',
    providerId: 'PR-00003',
    providerName: 'Baraka Nyerere',
    seats: 2,
    fare: { amount: 10400, currency: 'TZS' },
    status: 'CONFIRMED',
    createdAt: now(-8),
    updatedAt: now(-3),
  },
];

const MOCK_SCHEDULED: ScheduledTrip[] = [
  {
    id: 'ST-0001',
    tripId: 'TR-10483',
    customerName: 'Yusuf Bakari',
    originAddress: 'Mbezi Beach',
    destinationAddress: 'Posta',
    scheduledFor: now(23),
    providerAssigned: false,
    riskLevel: 'HIGH',
    riskReasons: ['PROVIDER_NOT_ASSIGNED'],
    minutesUntil: 23,
  },
  {
    id: 'ST-0002',
    tripId: 'TR-10484',
    customerName: 'Rashid Salim',
    originAddress: 'Kariakoo',
    destinationAddress: 'Airport',
    scheduledFor: now(45),
    providerAssigned: true,
    providerName: 'Juma Mwakalinga',
    riskLevel: 'MEDIUM',
    riskReasons: ['VERIFICATION_PROBLEM'],
    minutesUntil: 45,
  },
  {
    id: 'ST-0003',
    tripId: 'TR-10485',
    customerName: 'Zainab Salum',
    originAddress: 'Tabata',
    destinationAddress: 'Mwenge',
    scheduledFor: now(60),
    providerAssigned: true,
    providerName: 'Grace Mushi',
    riskLevel: 'LOW',
    riskReasons: [],
    minutesUntil: 60,
  },
];

const MOCK_JOURNEYS: CommunityJourney[] = [
  {
    id: 'JN-00234',
    providerId: 'PR-00004',
    providerName: 'Zainab Salum',
    originAddress: 'Mbezi Beach',
    originCoords: { lat: -6.7500, lng: 39.2600 },
    destinationAddress: 'Posta',
    destinationCoords: { lat: -6.8160, lng: 39.2890 },
    departureAt: now(1440),
    seatsAvailable: 3,
    seatsBooked: 2,
    vehicleType: 'CAR',
    vehiclePlate: 'T 234 GHI',
    costPerSeat: { amount: 3500, currency: 'TZS' },
    status: 'PUBLISHED',
    isRecurring: true,
    templateId: 'JT-00012',
    createdAt: now(-180),
    updatedAt: now(-60),
  },
  {
    id: 'JN-00233',
    providerId: 'PR-00008',
    providerName: 'Neema Mwakyusa',
    originAddress: 'Kinondoni',
    originCoords: { lat: -6.7930, lng: 39.2600 },
    destinationAddress: 'Ubungo',
    destinationCoords: { lat: -6.7860, lng: 39.2200 },
    departureAt: now(30),
    seatsAvailable: 2,
    seatsBooked: 1,
    vehicleType: 'CAR',
    vehiclePlate: 'T 567 JKL',
    costPerSeat: { amount: 4000, currency: 'TZS' },
    status: 'LIVE',
    isRecurring: false,
    createdAt: now(-90),
    updatedAt: now(-15),
  },
];

const MOCK_JOURNEY_TEMPLATES: JourneyTemplate[] = [
  {
    id: 'JT-00012',
    providerId: 'PR-00004',
    providerName: 'Zainab Salum',
    name: 'Mbezi Beach â†’ Posta (Weekday Morning)',
    originAddress: 'Mbezi Beach',
    destinationAddress: 'Posta',
    recurrenceDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    departureTime: '07:30',
    seatsAvailable: 3,
    costPerSeat: { amount: 3500, currency: 'TZS' },
    isActive: true,
    createdAt: now(-30 * 24 * 60),
  },
];

const MOCK_AVAILABILITY: ProviderAvailability[] = [
  {
    id: 'PA-0001',
    providerId: 'PR-00001',
    providerName: 'Juma Mwakalinga',
    capability: 'PROFESSIONAL',
    availability: 'AVAILABLE',
    city: 'Dar es Salaam',
    lastSeenAt: now(-1),
  },
  {
    id: 'PA-0002',
    providerId: 'PR-00002',
    providerName: 'Fatuma Hassan',
    capability: 'PROFESSIONAL',
    availability: 'OFFLINE',
    city: 'Dar es Salaam',
    lastSeenAt: now(-45),
  },
  {
    id: 'PA-0003',
    providerId: 'PR-00003',
    providerName: 'Baraka Nyerere',
    capability: 'PROFESSIONAL',
    availability: 'BUSY',
    city: 'Arusha',
    lastSeenAt: now(-2),
    activeTripId: 'TR-10480',
  },
  {
    id: 'PA-0004',
    providerId: 'PR-00004',
    providerName: 'Zainab Salum',
    capability: 'COMMUNITY',
    journeyStatus: 'PUBLISHED',
    city: 'Dar es Salaam',
    lastSeenAt: now(-30),
  },
];

const MOCK_EXCEPTIONS: Exception[] = [
  {
    id: 'EX-00091',
    type: 'SAFETY_INCIDENT',
    priority: 'CRITICAL',
    title: 'Safety incident requires review',
    description: 'SOS triggered on trip TR-10455. Awaiting operator triage.',
    entityType: 'INCIDENT',
    entityId: 'SAF-00091',
    entityLabel: 'SAF-00091',
    status: 'OPEN',
    createdAt: now(-11),
    updatedAt: now(-11),
  },
  {
    id: 'EX-00090',
    type: 'SCHEDULED_TRIP_NO_PROVIDER',
    priority: 'CRITICAL',
    title: 'Scheduled trip approaching without provider',
    description: 'Departure in 23 minutes â€” no provider matched yet.',
    entityType: 'TRIP',
    entityId: 'TR-10483',
    entityLabel: 'TR-10483',
    status: 'OPEN',
    createdAt: now(-18),
    updatedAt: now(-18),
  },
  {
    id: 'EX-00089',
    type: 'PAYMENT_FAILED',
    priority: 'HIGH',
    title: 'Payment failed â€” needs attention',
    description: 'M-Pesa provider returned failure. Customer notified.',
    entityType: 'PAYMENT',
    entityId: 'PY-00928',
    entityLabel: 'PY-00928',
    status: 'INVESTIGATING',
    assignedTo: 'STAFF-003',
    createdAt: now(-42),
    updatedAt: now(-30),
  },
  {
    id: 'EX-00088',
    type: 'REQUEST_NO_MATCH',
    priority: 'HIGH',
    title: 'Request with no matching provider',
    description: 'No eligible provider found for RQ-10830 after 30 minutes.',
    entityType: 'REQUEST',
    entityId: 'RQ-10830',
    entityLabel: 'RQ-10830',
    status: 'OPEN',
    createdAt: now(-60),
    updatedAt: now(-60),
  },
  {
    id: 'EX-00087',
    type: 'PAYOUT_FAILED',
    priority: 'MEDIUM',
    title: 'Payout failed â€” provider waiting',
    description: 'Payout PO-00229 to PR-00003 failed at M-Pesa.',
    entityType: 'PAYOUT',
    entityId: 'PO-00229',
    entityLabel: 'PO-00229',
    status: 'OPEN',
    createdAt: now(-240),
    updatedAt: now(-240),
  },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK CUSTOMERS (kwa Customer 360)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_CUSTOMER_360: Record<string, CustomerDetail> = {
  'CU-00082': {
    id: 'CU-00082',
    fullName: 'John Mwangi',
    phone: '+255712345678',
    email: 'john@example.com',
    accountStatus: 'ACTIVE',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    totalTrips: 42,
    totalSpent: { amount: 487000, currency: 'TZS' },
    rating: 4.9,
    city: 'Dar es Salaam',
    joinedAt: '2025-08-12T10:30:00Z',
    lastActiveAt: now(-5),
  },
  'CU-00045': {
    id: 'CU-00045',
    fullName: 'Amina Said',
    phone: '+255723456789',
    email: 'amina@example.com',
    accountStatus: 'ACTIVE',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    totalTrips: 18,
    totalSpent: { amount: 198000, currency: 'TZS' },
    rating: 4.7,
    city: 'Dar es Salaam',
    joinedAt: '2025-11-20T14:00:00Z',
    lastActiveAt: now(-45),
  },
  'CU-00091': {
    id: 'CU-00091',
    fullName: 'David Kimaro',
    phone: '+255734567890',
    accountStatus: 'ACTIVE',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    totalTrips: 27,
    totalSpent: { amount: 315000, currency: 'TZS' },
    rating: 4.8,
    city: 'Dar es Salaam',
    joinedAt: '2025-06-05T09:00:00Z',
    lastActiveAt: now(-90),
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// API
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const operationsApi = {
  // Live Operations
  getLive: async (): Promise<LiveOperationsData> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return MOCK_LIVE;
    }
    const { data } = await apiClient.get('/admin/dashboard/live-stats/');
    return data;
  },

  // Requests
  listRequests: async (params: RequestListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_REQUESTS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (r) =>
            r.id.toLowerCase().includes(s) ||
            r.customerName.toLowerCase().includes(s) ||
            r.originAddress.toLowerCase().includes(s) ||
            r.destinationAddress.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((r) => r.status === params.status);
      if (params.bookingType) items = items.filter((r) => r.bookingType === params.bookingType);
      if (params.rideAccessType) items = items.filter((r) => r.rideAccessType === params.rideAccessType);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/rides/', { params });
    return data;
  },

  // Matching
  getMatchingSession: async (requestId: string): Promise<MatchingSession | null> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const req = MOCK_REQUESTS.find((r) => r.id === requestId);
      if (!req) return null;
      return {
        id: `MS-${requestId}`,
        requestId,
        status: req.status === 'MATCHED' ? 'MATCHED' : 'SEARCHING',
        matchedProviderId: req.providerId,
        candidates: [
          { providerId: 'PR-00001', providerName: 'Juma Mwakalinga', distance: 1.2, eta: 4, rating: 4.8, vehicleType: 'BODA', capacity: 1, accepted: true },
          { providerId: 'PR-00006', providerName: 'Grace Mushi', distance: 2.1, eta: 7, rating: 4.95, vehicleType: 'CAR', capacity: 4, accepted: false, rejectedReason: 'BUSY' },
        ],
        startedAt: req.createdAt,
        attemptCount: 3,
      };
    }
    const { data } = await apiClient.get(`/admin/matching/${requestId}/`);
    return data;
  },

  // Trips
  listTrips: async (params: TripListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_TRIPS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (t) =>
            t.id.toLowerCase().includes(s) ||
            t.customerName.toLowerCase().includes(s) ||
            t.providerName?.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((t) => t.status === params.status);
      if (params.bookingType) items = items.filter((t) => t.bookingType === params.bookingType);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/trips/', { params });
    return data;
  },

  tripDetail: async (id: string): Promise<Trip> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const t = MOCK_TRIPS.find((x) => x.id === id);
      if (!t) throw new Error('Trip not found');
      return t;
    }
    const { data } = await apiClient.get(`/admin/trips/${id}/`);
    return data;
  },

  // Bookings
  listBookings: async (params: BookingListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_BOOKINGS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (b) =>
            b.id.toLowerCase().includes(s) ||
            b.customerName.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((b) => b.status === params.status);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/bookings/', { params });
    return data;
  },

  // Scheduled
  listScheduled: async (): Promise<ScheduledTrip[]> => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return MOCK_SCHEDULED;
    }
    const { data } = await apiClient.get('/admin/trips/scheduled/');
    return data;
  },

  // Journeys
  listJourneys: async (params: JourneyListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_JOURNEYS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (j) =>
            j.id.toLowerCase().includes(s) ||
            j.providerName.toLowerCase().includes(s) ||
            j.originAddress.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((j) => j.status === params.status);
      if (params.isRecurring !== undefined) items = items.filter((j) => j.isRecurring === params.isRecurring);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/journeys/', { params });
    return data;
  },

  listJourneyTemplates: async (): Promise<JourneyTemplate[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return MOCK_JOURNEY_TEMPLATES;
    }
    const { data } = await apiClient.get('/admin/journey-templates/');
    return data;
  },

  // Availability
  listAvailability: async (params: AvailabilityListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_AVAILABILITY];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter((a) => a.providerName.toLowerCase().includes(s));
      }
      if (params.capability) items = items.filter((a) => a.capability === params.capability);
      if (params.availability) items = items.filter((a) => a.availability === params.availability);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/providers/availability/', { params });
    return data;
  },

  // Exceptions
  listExceptions: async (params: ExceptionListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_EXCEPTIONS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (e) =>
            e.id.toLowerCase().includes(s) ||
            e.title.toLowerCase().includes(s)
        );
      }
      if (params.type) items = items.filter((e) => e.type === params.type);
      if (params.priority) items = items.filter((e) => e.priority === params.priority);
      if (params.status) items = items.filter((e) => e.status === params.status);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/exceptions/', { params });
    return data;
  },

  resolveException: async (id: string, resolution: string) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return { success: true };
    }
    const { data } = await apiClient.post(`/admin/exceptions/${id}/resolve/`, { resolution });
    return data;
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CUSTOMER API (kwa Customer 360)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const customerApi = {
  detail: async (id: string): Promise<CustomerDetail> => {
    await delay(300);
    const c = MOCK_CUSTOMER_360[id];
    if (!c) {
      // Fallback kwa ID yoyote
      return {
        id,
        fullName: `Customer ${id}`,
        phone: '+255700000000',
        accountStatus: 'ACTIVE',
        identityVerification: 'VERIFIED',
        phoneVerification: 'VERIFIED',
        totalTrips: 0,
        totalSpent: { amount: 0, currency: 'TZS' },
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
    }
    return c;
  },
};


