/**
 * Falcon Rider Admin Portal — Notifications Types
 */

export type NotificationSeverity = 'info' | 'warning' | 'danger' | 'success';

export interface AppNotification {
  id: string;
  title: string;
  description?: string;
  severity: NotificationSeverity;
  href?: string;
  read: boolean;
  createdAt: string;
}