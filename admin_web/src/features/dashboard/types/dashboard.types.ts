/**
 * Falcon Rider Admin Portal — Dashboard Types
 *
 * Types for Command Center (live operations, action center, metrics).
 */

// ─────────────────────────────────────────
// LIVE OPERATIONS
// ─────────────────────────────────────────

export interface LiveOperationsStats {
  activeTrips: number;
  providersOnline: number;
  providersAvailable: number;
  requestsSearching: number;
  requestsMatched: number;
  activeJourneys: number;
  availableSeats: number;
  scheduledApproaching: number;
}

// ─────────────────────────────────────────
// ACTION CENTER
// ─────────────────────────────────────────

export type ActionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ActionCategory =
  | 'VERIFICATION'
  | 'SCHEDULED_TRIP_RISK'
  | 'UNMATCHED_REQUEST'
  | 'PAYMENT_EXCEPTION'
  | 'SAFETY_INCIDENT'
  | 'REFUND_REQUEST'
  | 'PAYOUT_FAILURE'
  | 'SUPPORT_SLA'
  | 'NOTIFICATION_FAILURE'
  | 'SYSTEM_ERROR';

export interface ActionItem {
  id: string;
  category: ActionCategory;
  priority: ActionPriority;
  title: string;
  description: string;
  entityType: 'TRIP' | 'PROVIDER' | 'CUSTOMER' | 'PAYMENT' | 'INCIDENT' | 'CASE';
  entityId: string;
  entityLabel: string;
  createdAt: string;
  ageMinutes: number;
  assignedTo?: string;
  actions: ActionButton[];
}

export interface ActionButton {
  label: string;
  href?: string;
  action?: string;
  variant?: 'default' | 'outline' | 'destructive';
}

// ─────────────────────────────────────────
// KEY METRICS
// ─────────────────────────────────────────

export interface KeyMetric {
  id: string;
  label: string;
  value: number | string;
  formattedValue: string;
  change?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    isPositive: boolean;
  };
  comparisonLabel?: string;
}

// ─────────────────────────────────────────
// ACTIVITY FEED
// ─────────────────────────────────────────

export type ActivityEventType =
  | 'TRIP_STARTED'
  | 'TRIP_COMPLETED'
  | 'REQUEST_CREATED'
  | 'PROVIDER_MATCHED'
  | 'PROVIDER_VERIFIED'
  | 'PAYMENT_COMPLETED'
  | 'SAFETY_INCIDENT'
  | 'JOURNEY_PUBLISHED'
  | 'REFUND_APPROVED';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description?: string;
  timestamp: string;
  entityId?: string;
  entityType?: string;
  severity?: 'info' | 'warning' | 'danger' | 'success';
}

// ─────────────────────────────────────────
// MAP DATA
// ─────────────────────────────────────────

export interface LiveMapMarker {
  id: string;
  type: 'PROVIDER' | 'TRIP' | 'JOURNEY' | 'INCIDENT';
  lat: number;
  lng: number;
  label: string;
  status: string;
  entityId: string;
}

export interface LiveMapData {
  markers: LiveMapMarker[];
  center: { lat: number; lng: number };
  zoom: number;
}

// ─────────────────────────────────────────
// COMMAND CENTER (aggregate)
// ─────────────────────────────────────────

export interface CommandCenterData {
  liveOperations: LiveOperationsStats;
  actionItems: ActionItem[];
  keyMetrics: KeyMetric[];
  activityFeed: ActivityEvent[];
  mapData: LiveMapData;
  lastUpdated: string;
}

// ─────────────────────────────────────────
// FILTERS
// ─────────────────────────────────────────

export interface ActivityFeedParams {
  limit?: number;
  types?: ActivityEventType[];
}

export interface ActionCenterParams {
  priority?: ActionPriority;
  category?: ActionCategory;
  assignedTo?: string;
}