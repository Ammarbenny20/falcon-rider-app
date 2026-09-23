/**
 * Falcon Rider Admin Portal â€” Governance API
 */

import { apiClient } from '@/lib/api/client';
import { PERMISSIONS } from '@/config/permissions';
import type {
  StaffMember, StaffListParams,
  RoleDefinition, PermissionGroup,
  PlatformSettings, UpdateSettingsPayload,
} from '../types/governance.types';

const USE_MOCK_DATA = true;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_STAFF: StaffMember[] = [
  {
    id: 'STAFF-001',
    email: 'admin@falconrider.com',
    firstName: 'Super',
    lastName: 'Admin',
    fullName: 'Super Admin',
    role: 'SUPER_ADMIN',
    permissions: Object.values(PERMISSIONS),
    isActive: true,
    lastLoginAt: new Date(Date.now() - 10 * 60000).toISOString(),
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'STAFF-002',
    email: 'ops@falconrider.com',
    firstName: 'Ops',
    lastName: 'Admin',
    fullName: 'Ops Admin',
    role: 'OPERATIONS_ADMIN',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.OPERATIONS_VIEW,
      PERMISSIONS.TRIPS_VIEW,
      PERMISSIONS.TRIPS_LIVE,
      PERMISSIONS.REQUESTS_VIEW,
      PERMISSIONS.PROVIDERS_VIEW,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.JOURNEYS_VIEW,
      PERMISSIONS.MATCHING_VIEW,
    ],
    isActive: true,
    lastLoginAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdAt: '2025-02-10T10:00:00Z',
  },
  {
    id: 'STAFF-003',
    email: 'support@falconrider.com',
    firstName: 'Support',
    lastName: 'Agent',
    fullName: 'Support Agent',
    role: 'SUPPORT_AGENT',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SAFETY_VIEW,
      PERMISSIONS.CUSTOMERS_VIEW,
    ],
    isActive: true,
    lastLoginAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    createdAt: '2025-03-05T12:00:00Z',
  },
  {
    id: 'STAFF-004',
    email: 'finance@falconrider.com',
    firstName: 'Finance',
    lastName: 'Admin',
    fullName: 'Finance Admin',
    role: 'FINANCE_ADMIN',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PAYMENTS_VIEW,
      PERMISSIONS.PAYMENTS_REFUND,
      PERMISSIONS.REFUNDS_VIEW,
      PERMISSIONS.REFUNDS_APPROVE,
      PERMISSIONS.PAYOUTS_VIEW,
      PERMISSIONS.PAYOUTS_APPROVE,
      PERMISSIONS.RECONCILIATION_VIEW,
    ],
    isActive: true,
    lastLoginAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    createdAt: '2025-04-20T09:00:00Z',
  },
  {
    id: 'STAFF-005',
    email: 'safety@falconrider.com',
    firstName: 'Safety',
    lastName: 'Admin',
    fullName: 'Safety Admin',
    role: 'SAFETY_ADMIN',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SAFETY_VIEW,
      PERMISSIONS.SAFETY_INTERVENE,
    ],
    isActive: false,
    createdAt: '2025-05-12T14:00:00Z',
  },
];

const MOCK_ROLES: RoleDefinition[] = [
  {
    name: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Full platform access â€” can do everything',
    permissions: Object.values(PERMISSIONS),
    userCount: 1,
  },
  {
    name: 'OPERATIONS_ADMIN',
    label: 'Operations Admin',
    description: 'Operations, trips, providers, availability',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.OPERATIONS_VIEW,
      PERMISSIONS.TRIPS_VIEW,
      PERMISSIONS.TRIPS_LIVE,
      PERMISSIONS.REQUESTS_VIEW,
      PERMISSIONS.PROVIDERS_VIEW,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.JOURNEYS_VIEW,
      PERMISSIONS.MATCHING_VIEW,
    ],
    userCount: 3,
  },
  {
    name: 'SUPPORT_AGENT',
    label: 'Support Agent',
    description: 'Customer support and incident review',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SAFETY_VIEW,
      PERMISSIONS.CUSTOMERS_VIEW,
    ],
    userCount: 5,
  },
  {
    name: 'VERIFICATION_AGENT',
    label: 'Verification Agent',
    description: 'Provider verification and document review',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PROVIDERS_VIEW,
      PERMISSIONS.PROVIDERS_VERIFY,
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.VEHICLES_VIEW,
    ],
    userCount: 2,
  },
  {
    name: 'FINANCE_ADMIN',
    label: 'Finance Admin',
    description: 'Payments, refunds, payouts, reconciliation',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PAYMENTS_VIEW,
      PERMISSIONS.PAYMENTS_REFUND,
      PERMISSIONS.REFUNDS_VIEW,
      PERMISSIONS.REFUNDS_APPROVE,
      PERMISSIONS.PAYOUTS_VIEW,
      PERMISSIONS.PAYOUTS_APPROVE,
      PERMISSIONS.RECONCILIATION_VIEW,
      PERMISSIONS.RECEIPTS_VIEW,
      PERMISSIONS.DISPUTES_VIEW,
    ],
    userCount: 2,
  },
  {
    name: 'SAFETY_ADMIN',
    label: 'Safety Admin',
    description: 'Safety incidents, restrictions, appeals',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SAFETY_VIEW,
      PERMISSIONS.SAFETY_INTERVENE,
    ],
    userCount: 1,
  },
  {
    name: 'MODERATION_ADMIN',
    label: 'Moderation Admin',
    description: 'Content moderation and reports',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SAFETY_VIEW,
    ],
    userCount: 1,
  },
  {
    name: 'ANALYST',
    label: 'Analyst',
    description: 'Read-only access to analytics and reports',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.REPORTS_VIEW,
    ],
    userCount: 3,
  },
  {
    name: 'READ_ONLY',
    label: 'Read Only',
    description: 'Read-only access to platform data',
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
    userCount: 0,
  },
];

const MOCK_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'Dashboard',
    permissions: [{ key: PERMISSIONS.DASHBOARD_VIEW, label: 'View Dashboard' }],
  },
  {
    category: 'Operations',
    permissions: [
      { key: PERMISSIONS.OPERATIONS_VIEW, label: 'View Operations' },
      { key: PERMISSIONS.REQUESTS_VIEW, label: 'View Requests' },
      { key: PERMISSIONS.MATCHING_VIEW, label: 'View Matching' },
      { key: PERMISSIONS.MATCHING_INTERVENE, label: 'Intervene in Matching' },
      { key: PERMISSIONS.TRIPS_VIEW, label: 'View Trips' },
      { key: PERMISSIONS.TRIPS_LIVE, label: 'View Live Trips' },
      { key: PERMISSIONS.TRIPS_INTERVENE, label: 'Intervene in Trips' },
      { key: PERMISSIONS.BOOKINGS_VIEW, label: 'View Bookings' },
      { key: PERMISSIONS.JOURNEYS_VIEW, label: 'View Journeys' },
    ],
  },
  {
    category: 'People & Trust',
    permissions: [
      { key: PERMISSIONS.CUSTOMERS_VIEW, label: 'View Customers' },
      { key: PERMISSIONS.CUSTOMERS_EDIT, label: 'Edit Customers' },
      { key: PERMISSIONS.CUSTOMERS_SUSPEND, label: 'Suspend Customers' },
      { key: PERMISSIONS.PROVIDERS_VIEW, label: 'View Providers' },
      { key: PERMISSIONS.PROVIDERS_VERIFY, label: 'Verify Providers' },
      { key: PERMISSIONS.PROVIDERS_SUSPEND, label: 'Suspend Providers' },
      { key: PERMISSIONS.VEHICLES_VIEW, label: 'View Vehicles' },
      { key: PERMISSIONS.VEHICLES_MANAGE, label: 'Manage Vehicles' },
      { key: PERMISSIONS.DOCUMENTS_VIEW, label: 'View Documents' },
      { key: PERMISSIONS.DOCUMENTS_VERIFY, label: 'Verify Documents' },
    ],
  },
  {
    category: 'Money',
    permissions: [
      { key: PERMISSIONS.PAYMENTS_VIEW, label: 'View Payments' },
      { key: PERMISSIONS.PAYMENTS_REFUND, label: 'Refund Payments' },
      { key: PERMISSIONS.REFUNDS_VIEW, label: 'View Refunds' },
      { key: PERMISSIONS.REFUNDS_APPROVE, label: 'Approve Refunds' },
      { key: PERMISSIONS.PAYOUTS_VIEW, label: 'View Payouts' },
      { key: PERMISSIONS.PAYOUTS_APPROVE, label: 'Approve Payouts' },
      { key: PERMISSIONS.EARNINGS_VIEW, label: 'View Earnings' },
      { key: PERMISSIONS.RECEIPTS_VIEW, label: 'View Receipts' },
      { key: PERMISSIONS.DISPUTES_VIEW, label: 'View Disputes' },
      { key: PERMISSIONS.DISPUTES_RESOLVE, label: 'Resolve Disputes' },
      { key: PERMISSIONS.RECONCILIATION_VIEW, label: 'View Reconciliation' },
    ],
  },
  {
    category: 'Safety',
    permissions: [
      { key: PERMISSIONS.SAFETY_VIEW, label: 'View Safety Center' },
      { key: PERMISSIONS.SAFETY_INTERVENE, label: 'Intervene in Safety' },
      { key: PERMISSIONS.SAFETY_ESCALATE, label: 'Escalate Safety' },
    ],
  },
  {
    category: 'Insights',
    permissions: [
      { key: PERMISSIONS.ANALYTICS_VIEW, label: 'View Analytics' },
      { key: PERMISSIONS.REPORTS_VIEW, label: 'View Reports' },
      { key: PERMISSIONS.REPORTS_EXPORT, label: 'Export Reports' },
    ],
  },
  {
    category: 'Governance',
    permissions: [
      { key: PERMISSIONS.NOTIFICATIONS_VIEW, label: 'View Notifications' },
      { key: PERMISSIONS.NOTIFICATIONS_MANAGE, label: 'Manage Notifications' },
      { key: PERMISSIONS.STAFF_VIEW, label: 'View Staff' },
      { key: PERMISSIONS.STAFF_MANAGE, label: 'Manage Staff' },
      { key: PERMISSIONS.ROLES_VIEW, label: 'View Roles' },
      { key: PERMISSIONS.ROLES_MANAGE, label: 'Manage Roles' },
      { key: PERMISSIONS.AUDIT_VIEW, label: 'View Audit Log' },
      { key: PERMISSIONS.SETTINGS_VIEW, label: 'View Settings' },
      { key: PERMISSIONS.SETTINGS_MANAGE, label: 'Manage Settings' },
    ],
  },
];

const MOCK_SETTINGS: PlatformSettings = {
  professionalCommissionRate: 0.15,
  communityCommissionRate: 0.1,
  payoutMinimumThreshold: 50000,
  payoutOnDemandFee: 1000,
  payoutBatchDay: 'MONDAY',
  payoutBatchTime: '00:00',
  receiptPdfEnabled: false,
  demoMode: true,
  supportEmail: 'support@falconrider.com',
  supportPhone: '+255700000000',
  updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  updatedBy: 'STAFF-001',
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

export const governanceApi = {
  listStaff: async (params: StaffListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      let items = [...MOCK_STAFF];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (m) =>
            m.fullName.toLowerCase().includes(s) ||
            m.email.toLowerCase().includes(s) ||
            m.id.toLowerCase().includes(s)
        );
      }
      if (params.role) items = items.filter((m) => m.role === params.role);
      if (params.isActive !== undefined)
        items = items.filter((m) => m.isActive === params.isActive);
      return paginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/staff/', { params });
    return data;
  },

  listRoles: async (): Promise<RoleDefinition[]> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return MOCK_ROLES;
    }
    const { data } = await apiClient.get('/admin/roles/');
    return data;
  },

  listPermissions: async (): Promise<PermissionGroup[]> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return MOCK_PERMISSION_GROUPS;
    }
    const { data } = await apiClient.get('/admin/permissions/');
    return data;
  },

  getSettings: async (): Promise<PlatformSettings> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return MOCK_SETTINGS;
    }
    const { data } = await apiClient.get('/admin/settings/');
    return data;
  },

  updateSettings: async (
    payload: UpdateSettingsPayload
  ): Promise<PlatformSettings> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return {
        ...MOCK_SETTINGS,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
    }
    const { data } = await apiClient.patch('/admin/settings/', payload);
    return data;
  },
};


