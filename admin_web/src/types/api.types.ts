/**
 * Falcon Rider Admin Portal — API Types
 *
 * Types specific to HTTP/API layer.
 */

// ─────────────────────────────────────────
// HTTP METHODS
// ─────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

// ─────────────────────────────────────────
// REQUEST CONFIG
// ─────────────────────────────────────────

export interface RequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

// ─────────────────────────────────────────
// QUERY STATE
// ─────────────────────────────────────────

export interface QueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface MutationState<TData, TVariables> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

// ─────────────────────────────────────────
// QUERY KEYS
// ─────────────────────────────────────────

export type QueryKey = readonly [string, ...unknown[]];

export interface QueryKeyFactory {
  all: QueryKey;
  lists: () => QueryKey;
  list: (params?: unknown) => QueryKey;
  details: () => QueryKey;
  detail: (id: string) => QueryKey;
}

// ─────────────────────────────────────────
// SORT (TanStack Table)
// ─────────────────────────────────────────

export interface TableSort {
  id: string;
  desc: boolean;
}

// ─────────────────────────────────────────
// COLUMN FILTER
// ─────────────────────────────────────────

export interface TableColumnFilter {
  id: string;
  value: unknown;
}