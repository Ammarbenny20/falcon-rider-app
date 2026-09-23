/**
 * Falcon Rider Admin Portal — Safety & Support Types
 */

// ─────────────────────────────────────────
// INCIDENTS
// ─────────────────────────────────────────

export type IncidentStatus =
  | 'REPORTED'
  | 'TRIAGED'
  | 'INVESTIGATING'
  | 'ACTION_REQUIRED'
  | 'RESOLVED'
  | 'CLOSED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentType =
  | 'SOS'
  | 'SAFETY_CONCERN'
  | 'ACCIDENT'
  | 'HARASSMENT'
  | 'THEFT'
  | 'MEDICAL'
  | 'OTHER';

export interface SafetyIncident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  reportedById?: string;
  reportedByName?: string;
  customerId?: string;
  customerName?: string;
  providerId?: string;
  providerName?: string;
  tripId?: string;
  location?: { lat: number; lng: number; address?: string };
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface IncidentListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  type?: IncidentType;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─────────────────────────────────────────
// REPORTS (non-SOS)
// ─────────────────────────────────────────

export type ReportCategory =
  | 'PROVIDER_BEHAVIOR'
  | 'CUSTOMER_BEHAVIOR'
  | 'SERVICE_QUALITY'
  | 'FRAUD'
  | 'OTHER';

export interface Report {
  id: string;
  category: ReportCategory;
  description: string;
  reporterId: string;
  reporterName: string;
  reporterRole: 'CUSTOMER' | 'PROVIDER';
  reportedId: string;
  reportedName: string;
  reportedRole: 'CUSTOMER' | 'PROVIDER';
  tripId?: string;
  status: IncidentStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
}

export interface ReportListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: IncidentStatus;
  category?: ReportCategory;
}

// ─────────────────────────────────────────
// EMERGENCY (SOS)
// ─────────────────────────────────────────

export type EmergencyStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'FALSE_ALARM';

export interface EmergencyEvent {
  id: string;
  tripId?: string;
  customerId: string;
  customerName: string;
  providerId?: string;
  providerName?: string;
  location: { lat: number; lng: number; address?: string };
  status: EmergencyStatus;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  notes?: string;
}

export interface EmergencyListParams {
  page?: number;
  pageSize?: number;
  status?: EmergencyStatus;
}

// ─────────────────────────────────────────
// RESTRICTIONS
// ─────────────────────────────────────────

export type RestrictionStatus = 'ACTIVE' | 'EXPIRED' | 'LIFTED';
export type RestrictionType = 'SUSPENSION' | 'WARNING' | 'SHADOW_BAN' | 'PERMANENT_BAN';

export interface Restriction {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectRole: 'CUSTOMER' | 'PROVIDER';
  type: RestrictionType;
  reason: string;
  status: RestrictionStatus;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  liftedAt?: string;
  relatedIncidentId?: string;
}

export interface RestrictionListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: RestrictionStatus;
  type?: RestrictionType;
}

// ─────────────────────────────────────────
// APPEALS
// ─────────────────────────────────────────

export type AppealStatus = 'PENDING' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';

export interface Appeal {
  id: string;
  restrictionId: string;
  subjectId: string;
  subjectName: string;
  subjectRole: 'CUSTOMER' | 'PROVIDER';
  reason: string;
  status: AppealStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface AppealListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: AppealStatus;
}

// ─────────────────────────────────────────
// SUPPORT CASES
// ─────────────────────────────────────────

export type SupportStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'WAITING_FOR_CUSTOMER'
  | 'WAITING_FOR_PROVIDER'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type SupportCategory =
  | 'PAYMENT'
  | 'TRIP'
  | 'PROVIDER'
  | 'SAFETY'
  | 'ACCOUNT'
  | 'OTHER';

export interface SupportCase {
  id: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportStatus;
  subject: string;
  description: string;
  customerId?: string;
  customerName?: string;
  providerId?: string;
  providerName?: string;
  tripId?: string;
  assignedTo?: string;
  slaDeadline?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface SupportListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SupportStatus;
  priority?: SupportPriority;
  category?: SupportCategory;
}

// ─────────────────────────────────────────
// OVERVIEW
// ─────────────────────────────────────────

export interface SafetyOverview {
  activeIncidents: number;
  criticalIncidents: number;
  activeEmergencies: number;
  openReports: number;
  openAppeals: number;
  openSupportCases: number;
  overdueSla: number;
}