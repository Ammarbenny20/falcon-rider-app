/**
 * Falcon Rider Admin Portal â€” Dashboard API
 *
 * Command Center data.
 * Uses MOCK data until backend contract is confirmed.
 * Set USE_MOCK_DATA = false when backend is ready.
 */

import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type {
  CommandCenterData,
  LiveOperationsStats,
  ActionItem,
  KeyMetric,
  ActivityEvent,
  LiveMapData,
} from '../types/dashboard.types';

const USE_MOCK_DATA = true;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_LIVE_OPS: LiveOperationsStats = {
  activeTrips: 47,
  providersOnline: 183,
  providersAvailable: 92,
  requestsSearching: 8,
  requestsMatched: 39,
  activeJourneys: 14,
  availableSeats: 31,
  scheduledApproaching: 12,
};

const MOCK_ACTION_ITEMS: ActionItem[] = [
  {
    id: 'ACT-000001',
    category: 'SCHEDULED_TRIP_RISK',
    priority: 'CRITICAL',
    title: 'Scheduled trip approaching without provider',
    description: 'Departure in 23 minutes â€” no provider matched yet.',
    entityType: 'TRIP',
    entityId: 'TR-10483',
    entityLabel: 'Mbezi Beach â†’ Posta',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    ageMinutes: 15,
    actions: [
      { label: 'Find Provider', variant: 'default' },
      { label: 'Open Trip', variant: 'outline', href: '/operations/trips/TR-10483' },
    ],
  },
  {
    id: 'ACT-000002',
    category: 'SAFETY_INCIDENT',
    priority: 'CRITICAL',
    title: 'Safety incident requires review',
    description: 'SOS triggered on trip TR-10455. Awaiting operator triage.',
    entityType: 'INCIDENT',
    entityId: 'SAF-00091',
    entityLabel: 'TR-10455',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    ageMinutes: 8,
    actions: [
      { label: 'Open Incident', variant: 'destructive', href: '/safety/incidents/SAF-00091' },
    ],
  },
  {
    id: 'ACT-000003',
    category: 'PAYMENT_EXCEPTION',
    priority: 'HIGH',
    title: 'Payment failed â€” needs attention',
    description: 'M-Pesa provider returned failure. Customer notified.',
    entityType: 'PAYMENT',
    entityId: 'PY-00928',
    entityLabel: 'TZS 15,000',
    createdAt: new Date(Date.now() - 42 * 60000).toISOString(),
    ageMinutes: 42,
    actions: [
      { label: 'Review', variant: 'default', href: '/money/payments/PY-00928' },
      { label: 'Retry', variant: 'outline' },
    ],
  },
  {
    id: 'ACT-000004',
    category: 'VERIFICATION',
    priority: 'HIGH',
    title: '12 verifications pending review',
    description: 'Providers waiting for capability approval.',
    entityType: 'PROVIDER',
    entityId: 'QUEUE',
    entityLabel: '12 submissions',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    ageMinutes: 60,
    actions: [
      { label: 'Open Queue', variant: 'default', href: '/people/verification' },
    ],
  },
  {
    id: 'ACT-000005',
    category: 'REFUND_REQUEST',
    priority: 'MEDIUM',
    title: '7 refund requests awaiting approval',
    description: 'Customer disputes â€” requires finance review.',
    entityType: 'PAYMENT',
    entityId: 'REFUND_QUEUE',
    entityLabel: '7 requests',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    ageMinutes: 180,
    actions: [
      { label: 'Review', variant: 'default', href: '/money/refunds' },
    ],
  },
  {
    id: 'ACT-000006',
    category: 'PAYOUT_FAILURE',
    priority: 'MEDIUM',
    title: '5 payout records failed',
    description: 'Provider payouts did not complete overnight.',
    entityType: 'PAYMENT',
    entityId: 'PAYOUT_QUEUE',
    entityLabel: '5 failures',
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
    ageMinutes: 240,
    actions: [
      { label: 'Review', variant: 'default', href: '/money/payouts' },
    ],
  },
];

const MOCK_KEY_METRICS: KeyMetric[] = [
  {
    id: 'trips-today',
    label: 'Trips Today',
    value: 342,
    formattedValue: '342',
    change: { value: 8.3, direction: 'up', isPositive: true },
    comparisonLabel: 'vs yesterday',
  },
  {
    id: 'active-providers',
    label: 'Active Providers',
    value: 183,
    formattedValue: '183',
    change: { value: 2.1, direction: 'up', isPositive: true },
    comparisonLabel: 'vs 1 hour ago',
  },
  {
    id: 'match-rate',
    label: 'Match Rate',
    value: 94.2,
    formattedValue: '94.2%',
    change: { value: 1.4, direction: 'up', isPositive: true },
    comparisonLabel: 'vs yesterday',
  },
  {
    id: 'revenue-today',
    label: 'Revenue Today',
    value: 4820000,
    formattedValue: 'TZS 4.82M',
    change: { value: 12.5, direction: 'up', isPositive: true },
    comparisonLabel: 'vs yesterday',
  },
  {
    id: 'cancellation-rate',
    label: 'Cancellation Rate',
    value: 3.8,
    formattedValue: '3.8%',
    change: { value: 0.6, direction: 'down', isPositive: true },
    comparisonLabel: 'vs yesterday',
  },
  {
    id: 'avg-wait',
    label: 'Avg Wait Time',
    value: 4.2,
    formattedValue: '4.2 min',
    change: { value: 0.3, direction: 'down', isPositive: true },
    comparisonLabel: 'vs yesterday',
  },
];

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: 'EV-001',
    type: 'TRIP_COMPLETED',
    title: 'Trip TR-10482 completed',
    description: 'Mbezi Beach â†’ Kariakoo Â· TZS 12,500',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    entityId: 'TR-10482',
    entityType: 'TRIP',
    severity: 'success',
  },
  {
    id: 'EV-002',
    type: 'PROVIDER_VERIFIED',
    title: 'Provider PR-00031 verified',
    description: 'Professional capability approved by Ops Admin',
    timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
    entityId: 'PR-00031',
    entityType: 'PROVIDER',
    severity: 'info',
  },
  {
    id: 'EV-003',
    type: 'REQUEST_CREATED',
    title: 'New ride request',
    description: 'Posta â†’ Mwenge Â· NOW Â· Private',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    entityId: 'RQ-10847',
    entityType: 'REQUEST',
    severity: 'info',
  },
  {
    id: 'EV-004',
    type: 'SAFETY_INCIDENT',
    title: 'SOS triggered on TR-10455',
    description: 'Customer pressed SOS Â· Awaiting triage',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    entityId: 'SAF-00091',
    entityType: 'INCIDENT',
    severity: 'danger',
  },
  {
    id: 'EV-005',
    type: 'JOURNEY_PUBLISHED',
    title: 'Community journey published',
    description: 'Mbezi Beach â†’ Posta Â· Tomorrow 07:30 Â· 2 seats',
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    entityId: 'JN-00234',
    entityType: 'JOURNEY',
    severity: 'info',
  },
  {
    id: 'EV-006',
    type: 'PAYMENT_COMPLETED',
    title: 'Payment received PY-00931',
    description: 'M-Pesa Â· TZS 8,700',
    timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
    entityId: 'PY-00931',
    entityType: 'PAYMENT',
    severity: 'success',
  },
  {
    id: 'EV-007',
    type: 'PROVIDER_MATCHED',
    title: 'Provider matched to request',
    description: 'RQ-10845 â†’ PR-00052',
    timestamp: new Date(Date.now() - 26 * 60000).toISOString(),
    entityId: 'RQ-10845',
    entityType: 'REQUEST',
    severity: 'info',
  },
  {
    id: 'EV-008',
    type: 'REFUND_APPROVED',
    title: 'Refund approved',
    description: 'PY-00918 Â· TZS 15,000 Â· Duplicate charge',
    timestamp: new Date(Date.now() - 34 * 60000).toISOString(),
    entityId: 'PY-00918',
    entityType: 'PAYMENT',
    severity: 'success',
  },
];

const MOCK_MAP_DATA: LiveMapData = {
  markers: [
    { id: 'M1', type: 'PROVIDER', lat: -6.7924, lng: 39.2083, label: 'PR-00001', status: 'AVAILABLE', entityId: 'PR-00001' },
    { id: 'M2', type: 'PROVIDER', lat: -6.7850, lng: 39.2150, label: 'PR-00003', status: 'BUSY', entityId: 'PR-00003' },
    { id: 'M3', type: 'PROVIDER', lat: -6.8000, lng: 39.2200, label: 'PR-00006', status: 'AVAILABLE', entityId: 'PR-00006' },
    { id: 'M4', type: 'TRIP', lat: -6.7700, lng: 39.2400, label: 'TR-10482', status: 'IN_PROGRESS', entityId: 'TR-10482' },
    { id: 'M5', type: 'TRIP', lat: -6.8100, lng: 39.2300, label: 'TR-10483', status: 'EN_ROUTE', entityId: 'TR-10483' },
    { id: 'M6', type: 'JOURNEY', lat: -6.7600, lng: 39.2000, label: 'JN-00234', status: 'PUBLISHED', entityId: 'JN-00234' },
    { id: 'M7', type: 'INCIDENT', lat: -6.8250, lng: 39.2600, label: 'SAF-00091', status: 'ACTIVE', entityId: 'SAF-00091' },
  ],
  center: { lat: -6.7924, lng: 39.2083 },
  zoom: 12,
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// API
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const dashboardApi = {
  /**
   * Get complete Command Center data.
   */
  getCommandCenter: async (): Promise<CommandCenterData> => {
    if (USE_MOCK_DATA) {
      await mockDelay(400);
      return {
        liveOperations: MOCK_LIVE_OPS,
        actionItems: MOCK_ACTION_ITEMS,
        keyMetrics: MOCK_KEY_METRICS,
        activityFeed: MOCK_ACTIVITY,
        mapData: MOCK_MAP_DATA,
        lastUpdated: new Date().toISOString(),
      };
    }
    const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.OVERVIEW);
    return data;
  },

  /**
   * Get live operations stats only.
   */
  getLiveOperations: async (): Promise<LiveOperationsStats> => {
    if (USE_MOCK_DATA) {
      await mockDelay(300);
      return MOCK_LIVE_OPS;
    }
    const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.LIVE_STATS);
    return data;
  },

  /**
   * Get action center items.
   */
  getActionItems: async (): Promise<ActionItem[]> => {
    if (USE_MOCK_DATA) {
      await mockDelay(350);
      return MOCK_ACTION_ITEMS;
    }
    const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.ACTION_CENTER);
    return data;
  },

  /**
   * Get key metrics.
   */
  getKeyMetrics: async (): Promise<KeyMetric[]> => {
    if (USE_MOCK_DATA) {
      await mockDelay(300);
      return MOCK_KEY_METRICS;
    }
    const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.OVERVIEW);
    return data.keyMetrics;
  },

  /**
   * Get activity feed.
   */
  getActivityFeed: async (): Promise<ActivityEvent[]> => {
    if (USE_MOCK_DATA) {
      await mockDelay(300);
      return MOCK_ACTIVITY;
    }
    const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.OVERVIEW);
    return data.activityFeed;
  },

  /**
   * Get live map data.
   */
  getMapData: async (): Promise<LiveMapData> => {
    if (USE_MOCK_DATA) {
      await mockDelay(300);
      return MOCK_MAP_DATA;
    }
    const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.OVERVIEW);
    return data.mapData;
  },
};

function mockDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}




