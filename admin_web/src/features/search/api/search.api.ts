/**
 * Falcon Rider Admin Portal â€” Search API
 */

import { apiClient } from '@/lib/api/client';
import type { SearchGroup, SearchResult } from '../types/search.types';

const USE_MOCK_DATA = true;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_RESULTS: SearchResult[] = [
  { id: 'CU-00082', type: 'CUSTOMER', label: 'John Mwangi', description: '+255712345678', href: '/people/customers/CU-00082' },
  { id: 'CU-00045', type: 'CUSTOMER', label: 'Amina Said', description: '+255723456789', href: '/people/customers/CU-00045' },
  { id: 'CU-00091', type: 'CUSTOMER', label: 'David Kimaro', description: '+255734567890', href: '/people/customers/CU-00091' },
  { id: 'PR-00001', type: 'PROVIDER', label: 'Juma Mwakalinga', description: '+255712345678', href: '/people/providers/PR-00001' },
  { id: 'PR-00003', type: 'PROVIDER', label: 'Baraka Nyerere', description: '+255734567890', href: '/people/providers/PR-00003' },
  { id: 'PR-00006', type: 'PROVIDER', label: 'Grace Mushi', description: '+255767890123', href: '/people/providers/PR-00006' },
  { id: 'TR-10482', type: 'TRIP', label: 'Trip TR-10482', description: 'Mbezi Beach â†’ Kariakoo', href: '/operations/trips/TR-10482' },
  { id: 'TR-10481', type: 'TRIP', label: 'Trip TR-10481', description: 'Posta â†’ Mwenge', href: '/operations/trips/TR-10481' },
  { id: 'RQ-10847', type: 'REQUEST', label: 'Request RQ-10847', description: 'Posta â†’ Mwenge', href: '/operations/requests' },
  { id: 'PY-00931', type: 'PAYMENT', label: 'Payment PY-00931', description: 'M-Pesa Â· TZS 8,700', href: '/money/payments/PY-00931' },
  { id: 'PY-00928', type: 'PAYMENT', label: 'Payment PY-00928', description: 'M-Pesa Â· TZS 15,000', href: '/money/payments/PY-00928' },
  { id: 'RC-01023', type: 'RECEIPT', label: 'Receipt RC-01023', description: 'Trip TR-10482', href: '/money/receipts/RC-01023' },
  { id: 'JN-00234', type: 'JOURNEY', label: 'Journey JN-00234', description: 'Mbezi Beach â†’ Posta', href: '/operations/journeys' },
  { id: 'SAF-00091', type: 'INCIDENT', label: 'Incident SAF-00091', description: 'SOS on TR-10455', href: '/safety/incidents/SAF-00091' },
  { id: 'DS-00045', type: 'DISPUTE', label: 'Dispute DS-00045', description: 'Payment amount', href: '/money/disputes/DS-00045' },
];

const GROUP_LABELS: Record<string, string> = {
  CUSTOMER: 'Customers',
  PROVIDER: 'Providers',
  TRIP: 'Trips',
  BOOKING: 'Bookings',
  REQUEST: 'Requests',
  PAYMENT: 'Payments',
  RECEIPT: 'Receipts',
  JOURNEY: 'Journeys',
  INCIDENT: 'Incidents',
  SUPPORT_CASE: 'Support Cases',
  DISPUTE: 'Disputes',
  AUDIT_LOG: 'Audit Logs',
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// API
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const searchApi = {
  global: async (query: string): Promise<SearchGroup[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 200));
      if (!query || query.length < 2) return [];

      const q = query.toLowerCase();
      const matches = MOCK_RESULTS.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      );

      // Group by type
      const grouped = matches.reduce<Record<string, SearchResult[]>>((acc, r) => {
        if (!acc[r.type]) acc[r.type] = [];
        acc[r.type].push(r);
        return acc;
      }, {});

      return Object.entries(grouped).map(([type, results]) => ({
        type: type as SearchResult['type'],
        label: GROUP_LABELS[type] ?? type,
        results,
      }));
    }

    const { data } = await apiClient.get('/admin/search/', { params: { q: query } });
    return data;
  },
};

