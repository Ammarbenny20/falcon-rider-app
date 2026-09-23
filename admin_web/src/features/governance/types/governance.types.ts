/**
 * Falcon Rider Admin Portal — Governance Types
 */

import type { Role, Permission } from '@/config/permissions';

// ─────────────────────────────────────────
// STAFF
// ─────────────────────────────────────────

export interface StaffMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface StaffListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: Role;
  isActive?: boolean;
}

// ─────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────

export interface RoleDefinition {
  name: Role;
  label: string;
  description: string;
  permissions: Permission[];
  userCount: number;
}

// ─────────────────────────────────────────
// PERMISSIONS
// ─────────────────────────────────────────

export interface PermissionGroup {
  category: string;
  permissions: {
    key: Permission;
    label: string;
    description?: string;
  }[];
}

// ─────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────

export interface PlatformSettings {
  professionalCommissionRate: number;
  communityCommissionRate: number;
  payoutMinimumThreshold: number;
  payoutOnDemandFee: number;
  payoutBatchDay: string;
  payoutBatchTime: string;
  receiptPdfEnabled: boolean;
  demoMode: boolean;
  supportEmail: string;
  supportPhone: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface UpdateSettingsPayload {
  professionalCommissionRate?: number;
  communityCommissionRate?: number;
  payoutMinimumThreshold?: number;
  payoutOnDemandFee?: number;
  receiptPdfEnabled?: boolean;
  demoMode?: boolean;
  supportEmail?: string;
  supportPhone?: string;
}