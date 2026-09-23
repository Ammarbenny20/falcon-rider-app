/**
 * Falcon Rider Admin Portal â€” Safety API
 */

import { apiClient } from '@/lib/api/client';
import type {
  SafetyIncident, IncidentListParams,
  Report, ReportListParams,
  EmergencyEvent, EmergencyListParams,
  Restriction, RestrictionListParams,
  Appeal, AppealListParams,
  SupportCase, SupportListParams,
  SafetyOverview,
} from '../types/safety.types';

const USE_MOCK_DATA = true;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_INCIDENTS: SafetyIncident[] = [
  {
    id: 'SAF-00091',
    type: 'SOS',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    title: 'SOS triggered on trip TR-10455',
    description: 'Customer pressed SOS during trip. Operator acknowledged.',
    customerId: 'CU-00012',
    customerName: 'Fatuma Ali',
    providerId: 'PR-00005',
    providerName: 'Ramadhani Kileo',
    tripId: 'TR-10455',
    location: { lat: -6.825, lng: 39.26, address: 'Nyerere Rd, Dar es Salaam' },
    assignedTo: 'STAFF-007',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 'SAF-00090',
    type: 'SAFETY_CONCERN',
    severity: 'HIGH',
    status: 'TRIAGED',
    title: 'Provider reported for reckless driving',
    description: 'Customer reports excessive speed on highway.',
    customerId: 'CU-00034',
    customerName: 'Halima Mwinyi',
    providerId: 'PR-00003',
    providerName: 'Baraka Nyerere',
    tripId: 'TR-10440',
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
  {
    id: 'SAF-00089',
    type: 'ACCIDENT',
    severity: 'CRITICAL',
    status: 'ACTION_REQUIRED',
    title: 'Minor accident reported',
    description: 'Vehicle collision with no injuries. Insurance notified.',
    customerId: 'CU-00055',
    customerName: 'Yusuf Bakari',
    providerId: 'PR-00006',
    providerName: 'Grace Mushi',
    tripId: 'TR-10430',
    location: { lat: -6.79, lng: 39.21, address: 'Bagamoyo Rd, Dar es Salaam' },
    assignedTo: 'STAFF-007',
    createdAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
  },
  {
    id: 'SAF-00088',
    type: 'HARASSMENT',
    severity: 'HIGH',
    status: 'RESOLVED',
    title: 'Customer reported harassment',
    description: 'Resolved after investigation. Provider received warning.',
    customerId: 'CU-00078',
    customerName: 'Rashid Salim',
    providerId: 'PR-00008',
    providerName: 'Neema Mwakyusa',
    assignedTo: 'STAFF-007',
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    resolvedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    resolution: 'Provider received formal warning. Customer updated.',
  },
];

const MOCK_REPORTS: Report[] = [
  {
    id: 'RP-00045',
    category: 'PROVIDER_BEHAVIOR',
    description: 'Provider was rude and unprofessional.',
    reporterId: 'CU-00034',
    reporterName: 'Halima Mwinyi',
    reporterRole: 'CUSTOMER',
    reportedId: 'PR-00003',
    reportedName: 'Baraka Nyerere',
    reportedRole: 'PROVIDER',
    tripId: 'TR-10440',
    status: 'TRIAGED',
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
  {
    id: 'RP-00044',
    category: 'SERVICE_QUALITY',
    description: 'Vehicle was not clean.',
    reporterId: 'CU-00067',
    reporterName: 'Neema Joseph',
    reporterRole: 'CUSTOMER',
    reportedId: 'PR-00001',
    reportedName: 'Juma Mwakalinga',
    reportedRole: 'PROVIDER',
    tripId: 'TR-10450',
    status: 'REPORTED',
    createdAt: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
  },
];

const MOCK_EMERGENCIES: EmergencyEvent[] = [
  {
    id: 'EM-00023',
    tripId: 'TR-10455',
    customerId: 'CU-00012',
    customerName: 'Fatuma Ali',
    providerId: 'PR-00005',
    providerName: 'Ramadhani Kileo',
    location: { lat: -6.825, lng: 39.26, address: 'Nyerere Rd, Dar es Salaam' },
    status: 'ACTIVE',
    triggeredAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'EM-00022',
    tripId: 'TR-10420',
    customerId: 'CU-00089',
    customerName: 'Said Abdallah',
    location: { lat: -6.78, lng: 39.22, address: 'Msasani, Dar es Salaam' },
    status: 'RESOLVED',
    triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 60000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 115 * 60000).toISOString(),
    acknowledgedBy: 'STAFF-007',
    resolvedAt: new Date(Date.now() - 100 * 60000).toISOString(),
    notes: 'False alarm â€” customer confirmed safe.',
  },
];

const MOCK_RESTRICTIONS: Restriction[] = [
  {
    id: 'RS-00031',
    subjectId: 'PR-00005',
    subjectName: 'Ramadhani Kileo',
    subjectRole: 'PROVIDER',
    type: 'SUSPENSION',
    reason: 'Multiple safety reports pending investigation',
    status: 'ACTIVE',
    issuedBy: 'STAFF-007',
    issuedAt: new Date(Date.now() - 10 * 24 * 60 * 60000).toISOString(),
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60000).toISOString(),
    relatedIncidentId: 'SAF-00091',
  },
];

const MOCK_APPEALS: Appeal[] = [
  {
    id: 'AP-00010',
    restrictionId: 'RS-00030',
    subjectId: 'PR-00008',
    subjectName: 'Neema Mwakyusa',
    subjectRole: 'PROVIDER',
    reason: 'I have completed the safety training course.',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 60000).toISOString(),
  },
];

const MOCK_SUPPORT: SupportCase[] = [
  {
    id: 'CS-00089',
    category: 'PAYMENT',
    priority: 'HIGH',
    status: 'OPEN',
    subject: 'Payment not received',
    description: 'Customer says M-Pesa payment was deducted but trip shows unpaid.',
    customerId: 'CU-00091',
    customerName: 'David Kimaro',
    tripId: 'TR-10478',
    slaDeadline: new Date(Date.now() + 90 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'CS-00088',
    category: 'TRIP',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    subject: 'Wrong destination set',
    description: 'Customer complains trip ended at wrong location.',
    customerId: 'CU-00045',
    customerName: 'Amina Said',
    tripId: 'TR-10481',
    assignedTo: 'STAFF-003',
    slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'CS-00087',
    category: 'PROVIDER',
    priority: 'LOW',
    status: 'RESOLVED',
    subject: 'Provider rating dispute',
    description: 'Provider feels rating is unfair.',
    providerId: 'PR-00006',
    providerName: 'Grace Mushi',
    assignedTo: 'STAFF-003',
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    resolvedAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    resolution: 'Rating confirmed as valid.',
  },
];

const MOCK_OVERVIEW: SafetyOverview = {
  activeIncidents: 3,
  criticalIncidents: 2,
  activeEmergencies: 1,
  openReports: 2,
  openAppeals: 1,
  openSupportCases: 2,
  overdueSla: 0,
};

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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// API
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const safetyApi = {
  getOverview: async (): Promise<SafetyOverview> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return MOCK_OVERVIEW;
    }
    const { data } = await apiClient.get('/admin/safety/overview/');
    return data;
  },

  // Incidents
  listIncidents: async (params: IncidentListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_INCIDENTS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (i) =>
            i.id.toLowerCase().includes(s) ||
            i.title.toLowerCase().includes(s) ||
            i.customerName?.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((i) => i.status === params.status);
      if (params.severity) items = items.filter((i) => i.severity === params.severity);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/safety/', { params });
    return data;
  },

  resolveIncident: async (id: string, resolution: string) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return { success: true };
    }
    const { data } = await apiClient.post(`/admin/safety/${id}/resolve/`, { resolution });
    return data;
  },

  // Reports
  listReports: async (params: ReportListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_REPORTS];
      if (params.status) items = items.filter((r) => r.status === params.status);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/safety/reports/', { params });
    return data;
  },

  // Emergency
  listEmergency: async (params: EmergencyListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      let items = [...MOCK_EMERGENCIES];
      if (params.status) items = items.filter((e) => e.status === params.status);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/safety/emergency/', { params });
    return data;
  },

  // Restrictions
  listRestrictions: async (params: RestrictionListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_RESTRICTIONS];
      if (params.status) items = items.filter((r) => r.status === params.status);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/safety/restrictions/', { params });
    return data;
  },

  liftRestriction: async (id: string, reason: string) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return { success: true };
    }
    const { data } = await apiClient.post(`/admin/safety/restrictions/${id}/lift/`, { reason });
    return data;
  },

  // Appeals
  listAppeals: async (params: AppealListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_APPEALS];
      if (params.status) items = items.filter((a) => a.status === params.status);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/safety/appeals/', { params });
    return data;
  },

  reviewAppeal: async (id: string, action: 'accept' | 'reject', note: string) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return { success: true };
    }
    const { data } = await apiClient.post(`/admin/safety/appeals/${id}/review/`, { action, note });
    return data;
  },

  // Support
  listSupport: async (params: SupportListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_SUPPORT];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (c) =>
            c.id.toLowerCase().includes(s) ||
            c.subject.toLowerCase().includes(s) ||
            c.customerName?.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((c) => c.status === params.status);
      if (params.priority) items = items.filter((c) => c.priority === params.priority);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/support/', { params });
    return data;
  },
};


