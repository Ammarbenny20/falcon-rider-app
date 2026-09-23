/**
 * Falcon Rider Admin Portal â€” Notifications API
 */

import { apiClient } from '@/lib/api/client';
import type { AppNotification } from '../types/notifications.types';

const USE_MOCK_DATA = true;

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'N-001',
    title: 'Safety incident requires review',
    description: 'SOS triggered on trip TR-10455',
    severity: 'danger',
    href: '/safety/incidents/SAF-00091',
    read: false,
    createdAt: new Date(Date.now() - 11 * 60000).toISOString(),
  },
  {
    id: 'N-002',
    title: 'Scheduled trip at risk',
    description: 'TR-10483 departing in 23 minutes without provider',
    severity: 'warning',
    href: '/operations/scheduled',
    read: false,
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: 'N-003',
    title: '12 verifications pending',
    description: 'Providers awaiting capability approval',
    severity: 'info',
    href: '/people/verification',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'N-004',
    title: 'Payment failed',
    description: 'PY-00928 Â· M-Pesa returned failure',
    severity: 'danger',
    href: '/money/payments/PY-00928',
    read: true,
    createdAt: new Date(Date.now() - 42 * 60000).toISOString(),
  },
];

export const notificationsApi = {
  list: async (): Promise<AppNotification[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_NOTIFICATIONS;
    }
    const { data } = await apiClient.get('/admin/notifications/');
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 100));
      return;
    }
    await apiClient.post(`/admin/notifications/${id}/read/`);
  },

  markAllAsRead: async (): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 100));
      return;
    }
    await apiClient.post('/admin/notifications/mark-all-read/');
  },
};


