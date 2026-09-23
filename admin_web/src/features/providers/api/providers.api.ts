/**
 * Falcon Rider Admin Portal â€” Providers API
 *
 * API layer for provider operations.
 *
 * IMPORTANT:
 * - Mock data is enabled via USE_MOCK_DATA flag.
 * - When backend is ready, set USE_MOCK_DATA = false.
 * - Endpoints are marked [VERIFY] until confirmed.
 */

import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type {
  Provider,
  Provider360,
  ProviderListParams,
  ProviderVerificationAction,
} from '../types/provider.types';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FLAG â€” Badilisha kuwa false backend ikiwa tayari
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const USE_MOCK_DATA = true;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'PR-000001',
    userId: 'USR-001',
    fullName: 'Juma Mwakalinga',
    phone: '+255712345678',
    email: 'juma@example.com',
    accountStatus: 'ACTIVE',
    professionalCapability: 'APPROVED',
    communityCapability: 'APPROVED',
    professionalAvailability: 'AVAILABLE',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    rating: 4.8,
    totalTrips: 342,
    totalJourneys: 58,
    city: 'Dar es Salaam',
    country: 'Tanzania',
    createdAt: '2025-08-12T10:30:00Z',
    updatedAt: '2026-09-19T14:20:00Z',
  },
  {
    id: 'PR-000002',
    userId: 'USR-002',
    fullName: 'Fatuma Hassan',
    phone: '+255723456789',
    email: 'fatuma@example.com',
    accountStatus: 'PENDING_VERIFICATION',
    professionalCapability: 'PENDING_REVIEW',
    communityCapability: 'NOT_REQUESTED',
    professionalAvailability: 'OFFLINE',
    identityVerification: 'PENDING',
    phoneVerification: 'VERIFIED',
    rating: undefined,
    totalTrips: 0,
    totalJourneys: 0,
    city: 'Dar es Salaam',
    country: 'Tanzania',
    createdAt: '2026-09-15T08:15:00Z',
    updatedAt: '2026-09-15T08:15:00Z',
  },
  {
    id: 'PR-000003',
    userId: 'USR-003',
    fullName: 'Baraka Nyerere',
    phone: '+255734567890',
    email: 'baraka@example.com',
    accountStatus: 'ACTIVE',
    professionalCapability: 'APPROVED',
    communityCapability: 'PENDING_REVIEW',
    professionalAvailability: 'BUSY',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    rating: 4.9,
    totalTrips: 892,
    totalJourneys: 12,
    city: 'Arusha',
    country: 'Tanzania',
    createdAt: '2024-03-20T12:00:00Z',
    updatedAt: '2026-09-20T06:30:00Z',
  },
  {
    id: 'PR-000004',
    userId: 'USR-004',
    fullName: 'Zainab Salum',
    phone: '+255745678901',
    email: 'zainab@example.com',
    accountStatus: 'ACTIVE',
    professionalCapability: 'NOT_REQUESTED',
    communityCapability: 'APPROVED',
    professionalAvailability: 'OFFLINE',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    rating: 4.7,
    totalTrips: 0,
    totalJourneys: 156,
    city: 'Mwanza',
    country: 'Tanzania',
    createdAt: '2024-11-05T15:30:00Z',
    updatedAt: '2026-09-18T20:00:00Z',
  },
  {
    id: 'PR-000005',
    userId: 'USR-005',
    fullName: 'Ramadhani Kileo',
    phone: '+255756789012',
    email: 'rama@example.com',
    accountStatus: 'SUSPENDED',
    professionalCapability: 'SUSPENDED',
    communityCapability: 'NOT_REQUESTED',
    professionalAvailability: 'SUSPENDED',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    rating: 3.2,
    totalTrips: 45,
    totalJourneys: 0,
    city: 'Dodoma',
    country: 'Tanzania',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2026-09-10T11:45:00Z',
  },
  {
    id: 'PR-000006',
    userId: 'USR-006',
    fullName: 'Grace Mushi',
    phone: '+255767890123',
    email: 'grace@example.com',
    accountStatus: 'ACTIVE',
    professionalCapability: 'APPROVED',
    communityCapability: 'APPROVED',
    professionalAvailability: 'AVAILABLE',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    rating: 4.95,
    totalTrips: 1204,
    totalJourneys: 203,
    city: 'Dar es Salaam',
    country: 'Tanzania',
    createdAt: '2023-06-15T07:45:00Z',
    updatedAt: '2026-09-20T09:15:00Z',
  },
  {
    id: 'PR-000007',
    userId: 'USR-007',
    fullName: 'Ibrahim Mwinyi',
    phone: '+255778901234',
    email: 'ibrahim@example.com',
    accountStatus: 'PENDING_VERIFICATION',
    professionalCapability: 'PENDING_REVIEW',
    communityCapability: 'PENDING_REVIEW',
    professionalAvailability: 'OFFLINE',
    identityVerification: 'PENDING',
    phoneVerification: 'VERIFIED',
    rating: undefined,
    totalTrips: 0,
    totalJourneys: 0,
    city: 'Tanga',
    country: 'Tanzania',
    createdAt: '2026-09-18T14:20:00Z',
    updatedAt: '2026-09-18T14:20:00Z',
  },
  {
    id: 'PR-000008',
    userId: 'USR-008',
    fullName: 'Neema Mwakyusa',
    phone: '+255789012345',
    email: 'neema@example.com',
    accountStatus: 'ACTIVE',
    professionalCapability: 'NOT_REQUESTED',
    communityCapability: 'APPROVED',
    professionalAvailability: 'OFFLINE',
    identityVerification: 'VERIFIED',
    phoneVerification: 'VERIFIED',
    rating: 4.85,
    totalTrips: 0,
    totalJourneys: 89,
    city: 'Mbeya',
    country: 'Tanzania',
    createdAt: '2025-04-22T16:00:00Z',
    updatedAt: '2026-09-17T18:30:00Z',
  },
];

const MOCK_PROVIDER_360: Record<string, Provider360> = {
  'PR-000001': {
    ...MOCK_PROVIDERS[0],
    vehicles: [
      {
        id: 'VH-000001',
        providerId: 'PR-000001',
        vehicleType: 'BODA',
        make: 'Honda',
        model: 'CB125',
        plateNumber: 'MC 123 ABC',
        color: 'Red',
        capacity: 1,
        year: 2022,
        status: 'ACTIVE',
        createdAt: '2025-08-12T10:35:00Z',
        updatedAt: '2025-08-12T10:35:00Z',
      },
      {
        id: 'VH-000002',
        providerId: 'PR-000001',
        vehicleType: 'CAR',
        make: 'Toyota',
        model: 'Corolla',
        plateNumber: 'T 456 XYZ',
        color: 'White',
        capacity: 4,
        year: 2020,
        status: 'ACTIVE',
        createdAt: '2025-09-15T14:20:00Z',
        updatedAt: '2025-09-15T14:20:00Z',
      },
    ],
    documents: [
      {
        id: 'DOC-000001',
        providerId: 'PR-000001',
        type: 'IDENTITY',
        status: 'APPROVED',
        fileUrl: '/mock/documents/id-001.pdf',
        reviewedBy: 'STAFF-002',
        reviewedAt: '2025-08-13T09:00:00Z',
        createdAt: '2025-08-12T10:40:00Z',
        updatedAt: '2025-08-13T09:00:00Z',
      },
      {
        id: 'DOC-000002',
        providerId: 'PR-000001',
        type: 'LICENSE',
        status: 'APPROVED',
        fileUrl: '/mock/documents/license-001.pdf',
        expiresAt: '2027-05-15T00:00:00Z',
        reviewedBy: 'STAFF-002',
        reviewedAt: '2025-08-13T09:05:00Z',
        createdAt: '2025-08-12T10:42:00Z',
        updatedAt: '2025-08-13T09:05:00Z',
      },
      {
        id: 'DOC-000003',
        providerId: 'PR-000001',
        type: 'INSURANCE',
        status: 'APPROVED',
        fileUrl: '/mock/documents/insurance-001.pdf',
        expiresAt: '2026-12-31T00:00:00Z',
        reviewedBy: 'STAFF-002',
        reviewedAt: '2025-08-13T09:10:00Z',
        createdAt: '2025-08-12T10:45:00Z',
        updatedAt: '2025-08-13T09:10:00Z',
      },
    ],
    earnings: {
      totalEarned: 2450000,
      pendingPayout: 180000,
      lifetimePayouts: 2270000,
      currency: 'TZS',
      periodStart: '2026-09-01T00:00:00Z',
      periodEnd: '2026-09-30T23:59:59Z',
    },
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// API
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const providersApi = {
  /**
   * List providers with pagination, filters, sorting.
   */
  list: async (
    params: ProviderListParams = {}
  ): Promise<{
    results: Provider[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    if (USE_MOCK_DATA) {
      return mockListProviders(params);
    }

    const { data } = await apiClient.get(ENDPOINTS.PROVIDERS.LIST, { params });
    return data;
  },

  /**
   * Get provider 360 view.
   */
  detail: async (id: string): Promise<Provider360> => {
    if (USE_MOCK_DATA) {
      return mockGetProvider360(id);
    }

    const { data } = await apiClient.get(ENDPOINTS.PROVIDERS.DETAIL(id));
    return data;
  },

  /**
   * Approve or reject provider capability.
   */
  verifyCapability: async (
    action: ProviderVerificationAction
  ): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK_DATA) {
      await mockDelay(800);
      return {
        success: true,
        message: `Capability ${action.action.toLowerCase()}d successfully.`,
      };
    }

    const endpoint =
      action.action === 'APPROVE'
        ? ENDPOINTS.PROVIDERS.APPROVE(action.providerId)
        : ENDPOINTS.PROVIDERS.REJECT(action.providerId);

    const { data } = await apiClient.post(endpoint, {
      capability: action.capability,
      reason: action.reason,
    });
    return data;
  },

  /**
   * Suspend provider account.
   */
  suspend: async (id: string, reason: string): Promise<{ success: boolean }> => {
    if (USE_MOCK_DATA) {
      await mockDelay(800);
      return { success: true };
    }

    const { data } = await apiClient.post(ENDPOINTS.PROVIDERS.SUSPEND(id), {
      reason,
    });
    return data;
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK IMPLEMENTATIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function mockListProviders(params: ProviderListParams) {
  await mockDelay(500);

  let filtered = [...MOCK_PROVIDERS];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.fullName.toLowerCase().includes(search) ||
        p.phone.includes(search) ||
        p.id.toLowerCase().includes(search) ||
        (p.email && p.email.toLowerCase().includes(search))
    );
  }

  if (params.accountStatus) {
    filtered = filtered.filter((p) => p.accountStatus === params.accountStatus);
  }

  if (params.professionalCapability) {
    filtered = filtered.filter(
      (p) => p.professionalCapability === params.professionalCapability
    );
  }

  if (params.communityCapability) {
    filtered = filtered.filter(
      (p) => p.communityCapability === params.communityCapability
    );
  }

  if (params.city) {
    filtered = filtered.filter((p) => p.city === params.city);
  }

  // Sorting
  if (params.sortBy) {
    const dir = params.sortDirection === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[params.sortBy!];
      const bv = (b as unknown as Record<string, unknown>)[params.sortBy!];
      if (av === bv) return 0;
      return (av as string) > (bv as string) ? dir : -dir;
    });
  }

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return {
    results: paginated,
    totalItems: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

async function mockGetProvider360(id: string): Promise<Provider360> {
  await mockDelay(500);

  const base = MOCK_PROVIDERS.find((p) => p.id === id);
  if (!base) {
    throw new Error(`Provider ${id} not found`);
  }

  const detail = MOCK_PROVIDER_360[id];
  if (detail) {
    return detail;
  }

  // Fallback: base provider with empty relations
  return {
    ...base,
    vehicles: [],
    documents: [],
  };
}

function mockDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


