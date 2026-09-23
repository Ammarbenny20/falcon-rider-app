/**
 * Falcon Rider Admin Portal — Common Types
 *
 * Foundational types used across the entire application.
 * These represent generic patterns (pagination, API, filters).
 */

// ─────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ─────────────────────────────────────────
// SORTING
// ─────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export interface SortParams {
  sortBy?: string;
  sortDirection?: SortDirection;
}

// ─────────────────────────────────────────
// FILTERING
// ─────────────────────────────────────────

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'between';

export interface FilterCondition<T = unknown> {
  field: string;
  operator: FilterOperator;
  value: T;
}

export interface QueryParams extends PaginationParams, SortParams {
  search?: string;
  filters?: FilterCondition[];
}

// ─────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
  requestId?: string;
}

export interface ApiErrorResponse {
  error: ApiError;
  timestamp?: string;
  path?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
  requestId?: string;
}

// ─────────────────────────────────────────
// STATUS
// ─────────────────────────────────────────

export type GenericStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'FAILED'
  | 'EXPIRED';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'default';

// ─────────────────────────────────────────
// DATE RANGE
// ─────────────────────────────────────────

export interface DateRange {
  from: Date | string | null;
  to: Date | string | null;
}

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom';

// ─────────────────────────────────────────
// SELECT OPTIONS
// ─────────────────────────────────────────

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

// ─────────────────────────────────────────
// LOCATION
// ─────────────────────────────────────────

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  placeId?: string;
}

// ─────────────────────────────────────────
// MONEY
// ─────────────────────────────────────────

export interface Money {
  amount: number;
  currency: string;
}

export type CurrencyCode = 'TZS' | 'USD' | 'EUR' | 'KES' | 'UGX';

// ─────────────────────────────────────────
// AUDIT
// ─────────────────────────────────────────

export interface AuditMetadata {
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// ─────────────────────────────────────────
// ENTITY ID
// ─────────────────────────────────────────

export type EntityId = string;

export interface BaseEntity {
  id: EntityId;
  createdAt: string;
  updatedAt: string;
}