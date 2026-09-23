/**
 * Falcon Rider Admin Portal — API Endpoints
 *
 * Centralized API endpoint definitions.
 *
 * IMPORTANT:
 * - These are based on the expected backend contract.
 * - Each endpoint marked [VERIFY] must be confirmed with backend.
 * - Do NOT assume an endpoint exists until verified.
 * - Update this file when backend contract is confirmed.
 */

export const ENDPOINTS = {
  // ─────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────
  AUTH: {
    LOGIN: '/auth/login/', // [VERIFY]
    LOGOUT: '/auth/logout/',
    ME: '/auth/me/',
    REFRESH: '/auth/refresh/', // [VERIFY]
    REQUEST_OTP: '/auth/request-otp/',
    VERIFY_OTP: '/auth/verify-otp/',
  },

  // ─────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────
  DASHBOARD: {
    OVERVIEW: '/admin/dashboard/overview/', // [VERIFY]
    LIVE_STATS: '/admin/dashboard/live-stats/', // [VERIFY]
    ACTION_CENTER: '/admin/dashboard/action-center/', // [VERIFY]
  },

  // ─────────────────────────────────────────
  // OPERATIONS — REQUESTS
  // ─────────────────────────────────────────
  REQUESTS: {
    LIST: '/admin/requests/',
    DETAIL: (id: string) => `/admin/requests/${id}/`,
    LIVE: '/admin/requests/live/', // [VERIFY]
  },

  // ─────────────────────────────────────────
  // OPERATIONS — MATCHING
  // ─────────────────────────────────────────
  MATCHING: {
    LIST: '/admin/matching/',
    DETAIL: (id: string) => `/admin/matching/${id}/`,
  },

  // ─────────────────────────────────────────
  // OPERATIONS — TRIPS
  // ─────────────────────────────────────────
  TRIPS: {
    LIST: '/admin/trips/',
    LIVE: '/admin/trips/live/', // [VERIFY]
    DETAIL: (id: string) => `/admin/trips/${id}/`,
    INTERVENE: (id: string) => `/admin/trips/${id}/intervene/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // OPERATIONS — BOOKINGS
  // ─────────────────────────────────────────
  BOOKINGS: {
    LIST: '/admin/bookings/',
    DETAIL: (id: string) => `/admin/bookings/${id}/`,
  },

  // ─────────────────────────────────────────
  // OPERATIONS — JOURNEYS
  // ─────────────────────────────────────────
  JOURNEYS: {
    LIST: '/admin/journeys/',
    DETAIL: (id: string) => `/admin/journeys/${id}/`,
  },

  // ─────────────────────────────────────────
  // PEOPLE — CUSTOMERS
  // ─────────────────────────────────────────
  CUSTOMERS: {
    LIST: '/admin/users/',
    DETAIL: (id: string) => `/admin/users/${id}/`,
    SUSPEND: (id: string) => `/admin/users/${id}/suspend/`, // [VERIFY]
    ACTIVATE: (id: string) => `/admin/users/${id}/activate/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // PEOPLE — PROVIDERS
  // ─────────────────────────────────────────
  PROVIDERS: {
    LIST: '/admin/providers/',
    DETAIL: (id: string) => `/admin/providers/${id}/`,
    PENDING: '/admin/providers/pending/', // [VERIFY]
    APPROVE: (id: string) => `/admin/providers/${id}/approve/`, // [VERIFY]
    REJECT: (id: string) => `/admin/providers/${id}/reject/`, // [VERIFY]
    SUSPEND: (id: string) => `/admin/providers/${id}/suspend/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // PEOPLE — VEHICLES
  // ─────────────────────────────────────────
  VEHICLES: {
    LIST: '/admin/vehicles/',
    DETAIL: (id: string) => `/admin/vehicles/${id}/`,
  },

  // ─────────────────────────────────────────
  // PEOPLE — DOCUMENTS
  // ─────────────────────────────────────────
  DOCUMENTS: {
    LIST: '/admin/documents/',
    DETAIL: (id: string) => `/admin/documents/${id}/`,
    VERIFY: (id: string) => `/admin/documents/${id}/verify/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // PEOPLE — VERIFICATION
  // ─────────────────────────────────────────
  VERIFICATION: {
    QUEUE: '/admin/verification/queue/', // [VERIFY]
    DETAIL: (id: string) => `/admin/verification/${id}/`, // [VERIFY]
    APPROVE: (id: string) => `/admin/verification/${id}/approve/`, // [VERIFY]
    REJECT: (id: string) => `/admin/verification/${id}/reject/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // MONEY — PAYMENTS
  // ─────────────────────────────────────────
  PAYMENTS: {
    LIST: '/admin/payments/',
    DETAIL: (id: string) => `/admin/payments/${id}/`,
    REFUND: (id: string) => `/admin/payments/${id}/refund/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // MONEY — REFUNDS
  // ─────────────────────────────────────────
  REFUNDS: {
    LIST: '/admin/refunds/', // [VERIFY]
    DETAIL: (id: string) => `/admin/refunds/${id}/`, // [VERIFY]
    APPROVE: (id: string) => `/admin/refunds/${id}/approve/`, // [VERIFY]
    REJECT: (id: string) => `/admin/refunds/${id}/reject/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // MONEY — PAYOUTS
  // ─────────────────────────────────────────
  PAYOUTS: {
    LIST: '/admin/payouts/', // [VERIFY]
    DETAIL: (id: string) => `/admin/payouts/${id}/`, // [VERIFY]
    APPROVE: (id: string) => `/admin/payouts/${id}/approve/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // MONEY — EARNINGS
  // ─────────────────────────────────────────
  EARNINGS: {
    LIST: '/admin/earnings/', // [VERIFY]
  },

  // ─────────────────────────────────────────
  // MONEY — RECEIPTS
  // ─────────────────────────────────────────
  RECEIPTS: {
    LIST: '/admin/receipts/', // [VERIFY]
    DETAIL: (id: string) => `/admin/receipts/${id}/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // MONEY — DISPUTES
  // ─────────────────────────────────────────
  DISPUTES: {
    LIST: '/admin/disputes/', // [VERIFY]
    DETAIL: (id: string) => `/admin/disputes/${id}/`, // [VERIFY]
    RESOLVE: (id: string) => `/admin/disputes/${id}/resolve/`, // [VERIFY]
  },

  // ─────────────────────────────────────────
  // MONEY — RECONCILIATION
  // ─────────────────────────────────────────
  RECONCILIATION: {
    LIST: '/admin/reconciliation/', // [VERIFY]
    EXCEPTIONS: '/admin/reconciliation/exceptions/', // [VERIFY]
  },

  // ─────────────────────────────────────────
  // SAFETY
  // ─────────────────────────────────────────
  SAFETY: {
    INCIDENTS: '/admin/safety/incidents/', // [VERIFY]
    INCIDENT_DETAIL: (id: string) => `/admin/safety/incidents/${id}/`, // [VERIFY]
    REPORTS: '/admin/safety/reports/', // [VERIFY]
    EMERGENCY: '/admin/safety/emergency/', // [VERIFY]
    RESTRICTIONS: '/admin/safety/restrictions/', // [VERIFY]
    APPEALS: '/admin/safety/appeals/', // [VERIFY]
  },

  // ─────────────────────────────────────────
  // ANALYTICS
  // ─────────────────────────────────────────
  ANALYTICS: {
    MARKETPLACE: '/admin/analytics/marketplace/', // [VERIFY]
    MOBILITY: '/admin/analytics/mobility/', // [VERIFY]
    CUSTOMERS: '/admin/analytics/customers/', // [VERIFY]
    PROVIDERS: '/admin/analytics/providers/', // [VERIFY]
    JOURNEYS: '/admin/analytics/journeys/', // [VERIFY]
    FINANCE: '/admin/analytics/finance/', // [VERIFY]
    GEOGRAPHY: '/admin/analytics/geography/', // [VERIFY]
    REPORTS: '/admin/reports/', // [VERIFY]
  },

  // ─────────────────────────────────────────
  // GOVERNANCE
  // ─────────────────────────────────────────
  NOTIFICATIONS: {
    LIST: '/admin/notifications/',
    DETAIL: (id: string) => `/admin/notifications/${id}/`,
  },

  STAFF: {
    LIST: '/admin/staff/', // [VERIFY]
    DETAIL: (id: string) => `/admin/staff/${id}/`, // [VERIFY]
  },

  ROLES: {
    LIST: '/admin/roles/', // [VERIFY]
    DETAIL: (id: string) => `/admin/roles/${id}/`, // [VERIFY]
  },

  AUDIT: {
    LOGS: '/admin/audit-logs/', // [VERIFY]
    DETAIL: (id: string) => `/admin/audit-logs/${id}/`, // [VERIFY]
  },

  SETTINGS: {
    PLATFORM: '/admin/settings/platform/', // [VERIFY]
    UPDATE: '/admin/settings/platform/', // [VERIFY]
  },

  // ─────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────
  SEARCH: {
    GLOBAL: '/admin/search/', // [VERIFY]
  },
} as const;