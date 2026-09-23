/**
 * Falcon Rider Admin Portal — Permission Definitions
 *
 * Centralized permission constants.
 * These mirror backend permissions exactly.
 *
 * IMPORTANT: Frontend permission checks are for UX only.
 * Backend MUST enforce all permissions authoritatively.
 */

export const PERMISSIONS = {
  // ─────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────
  DASHBOARD_VIEW: 'dashboard.view',

  // ─────────────────────────────────────────
  // OPERATIONS
  // ─────────────────────────────────────────
  OPERATIONS_VIEW: 'operations.view',
  REQUESTS_VIEW: 'requests.view',
  MATCHING_VIEW: 'matching.view',
  MATCHING_INTERVENE: 'matching.intervene',
  TRIPS_VIEW: 'trips.view',
  TRIPS_LIVE: 'trips.live',
  TRIPS_INTERVENE: 'trips.intervene',
  BOOKINGS_VIEW: 'bookings.view',
  JOURNEYS_VIEW: 'journeys.view',

  // ─────────────────────────────────────────
  // PEOPLE & TRUST
  // ─────────────────────────────────────────
  CUSTOMERS_VIEW: 'customers.view',
  CUSTOMERS_EDIT: 'customers.edit',
  CUSTOMERS_SUSPEND: 'customers.suspend',
  PROVIDERS_VIEW: 'providers.view',
  PROVIDERS_VERIFY: 'providers.verify',
  PROVIDERS_SUSPEND: 'providers.suspend',
  VEHICLES_VIEW: 'vehicles.view',
  VEHICLES_MANAGE: 'vehicles.manage',
  DOCUMENTS_VIEW: 'documents.view',
  DOCUMENTS_VERIFY: 'documents.verify',

  // ─────────────────────────────────────────
  // MONEY
  // ─────────────────────────────────────────
  PAYMENTS_VIEW: 'payments.view',
  PAYMENTS_REFUND: 'payments.refund',
  REFUNDS_VIEW: 'refunds.view',
  REFUNDS_APPROVE: 'refunds.approve',
  PAYOUTS_VIEW: 'payouts.view',
  PAYOUTS_APPROVE: 'payouts.approve',
  EARNINGS_VIEW: 'earnings.view',
  RECEIPTS_VIEW: 'receipts.view',
  DISPUTES_VIEW: 'disputes.view',
  DISPUTES_RESOLVE: 'disputes.resolve',
  RECONCILIATION_VIEW: 'reconciliation.view',
  RECONCILIATION_MANAGE: 'reconciliation.manage',

  // ─────────────────────────────────────────
  // SAFETY
  // ─────────────────────────────────────────
  SAFETY_VIEW: 'safety.view',
  SAFETY_INTERVENE: 'safety.intervene',
  SAFETY_ESCALATE: 'safety.escalate',

  // ─────────────────────────────────────────
  // INSIGHTS
  // ─────────────────────────────────────────
  ANALYTICS_VIEW: 'analytics.view',
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',

  // ─────────────────────────────────────────
  // GOVERNANCE
  // ─────────────────────────────────────────
  NOTIFICATIONS_VIEW: 'notifications.view',
  NOTIFICATIONS_MANAGE: 'notifications.manage',
  STAFF_VIEW: 'staff.view',
  STAFF_MANAGE: 'staff.manage',
  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',
  AUDIT_VIEW: 'audit.view',
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_MANAGE: 'settings.manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role definitions — mirror backend roles.
 * Actual role-permission mapping comes from backend on login.
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  OPERATIONS_ADMIN: 'OPERATIONS_ADMIN',
  SUPPORT_AGENT: 'SUPPORT_AGENT',
  VERIFICATION_AGENT: 'VERIFICATION_AGENT',
  FINANCE_ADMIN: 'FINANCE_ADMIN',
  SAFETY_ADMIN: 'SAFETY_ADMIN',
  MODERATION_ADMIN: 'MODERATION_ADMIN',
  ANALYST: 'ANALYST',
  READ_ONLY: 'READ_ONLY',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Role display names — for UI
 */
export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  OPERATIONS_ADMIN: 'Operations Admin',
  SUPPORT_AGENT: 'Support Agent',
  VERIFICATION_AGENT: 'Verification Agent',
  FINANCE_ADMIN: 'Finance Admin',
  SAFETY_ADMIN: 'Safety Admin',
  MODERATION_ADMIN: 'Moderation Admin',
  ANALYST: 'Analyst',
  READ_ONLY: 'Read Only',
};