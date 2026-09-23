/**
 * Falcon Rider Admin Portal — Search Types
 */

export type SearchEntityType =
  | 'CUSTOMER'
  | 'PROVIDER'
  | 'TRIP'
  | 'BOOKING'
  | 'REQUEST'
  | 'PAYMENT'
  | 'RECEIPT'
  | 'JOURNEY'
  | 'INCIDENT'
  | 'SUPPORT_CASE'
  | 'DISPUTE'
  | 'AUDIT_LOG';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  label: string;
  description?: string;
  href: string;
  metadata?: Record<string, string>;
}

export interface SearchGroup {
  type: SearchEntityType;
  label: string;
  results: SearchResult[];
}