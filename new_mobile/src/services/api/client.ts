// src/services/api/client.ts

import { env } from '@/config/env';
import { ApiError } from '@/services/api/errors';
import type { RequestOptions } from '@/services/api/types';
import { useSessionStore } from '@/features/auth/store/session.store';
import { sessionService } from '@/features/auth/services/session.service';
import type { RefreshResult } from '@/features/auth/types/session.types';

// Re-export for backward compatibility.
// Existing consumers imported ApiError from this module.
export { ApiError };

/**
 * Module-level guard: at most one refresh in flight at a time.
 *
 * When multiple requests receive 401 simultaneously, they all await the same
 * refresh promise instead of triggering N refreshes. This is the standard
 * pattern for correct 401 handling in a client with refresh tokens.
 *
 * Reset to null after the refresh settles.
 */
let refreshPromise: Promise<RefreshResult> | null = null;

function extractErrorMessage(body: unknown): {
  message: string;
  fieldErrors?: Record<string, string[]>;
} {
  if (!body || typeof body !== 'object') {
    return { message: 'Something went wrong. Please try again.' };
  }

  const data = body as Record<string, unknown>;

  if (typeof data.detail === 'string') {
    return { message: data.detail };
  }

  const fieldErrors: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      fieldErrors[key] = value as string[];
    }
  }

  const entries = Object.entries(fieldErrors);
  if (entries.length > 0) {
    const [firstField, firstMessages] = entries[0];
    const prefix =
      firstField === 'non_field_errors'
        ? ''
        : `${firstField.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}: `;
    return { message: `${prefix}${firstMessages[0]}`, fieldErrors };
  }

  return { message: 'Something went wrong. Please try again.' };
}

/**
 * Attempt a single session refresh, sharing the in-flight promise.
 *
 * Returns the RefreshResult. Never throws.
 */
async function attemptRefresh(): Promise<RefreshResult> {
  if (!refreshPromise) {
    refreshPromise = sessionService
      .refreshSession()
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Perform an HTTP request with authentication, 401 handling, and single retry.
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
  requestOptions: RequestOptions = {},
  isRetry: boolean = false,
): Promise<T> {
  const accessToken = useSessionStore.getState().session?.accessToken ?? null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (!requestOptions.skipAuth && accessToken) {
    headers.Authorization = `Token ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    if (__DEV__) {
      // Structured dev-only log. Never log tokens.
      console.warn('[apiClient] network error', path, networkError);
    }
    throw new ApiError(
      0,
      "We couldn't connect to Falcon Rider. Check your connection and try again.",
    );
  }

  // --- 401 handling: refresh once, then retry once ---
  if (response.status === 401 && !isRetry && !requestOptions.skipAuth) {
    const refreshResult = await attemptRefresh();

    if (refreshResult.outcome === 'success') {
      // Retry the original request exactly once.
      return request<T>(path, options, requestOptions, true);
    }

    // Refresh not attempted (current backend) or failed.
    // Clear local session; navigation layer will move the user to auth.
    useSessionStore.getState().clearSession();
    const body = await response.json().catch(() => null);
    const { message } = extractErrorMessage(body);
    throw new ApiError(401, message || 'Please log in again to continue.');
  }

  // --- Normal error handling ---
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const { message, fieldErrors } = extractErrorMessage(body);
    if (__DEV__) {
      console.warn('[apiClient] error response', response.status, path, body);
    }
    throw new ApiError(response.status, message, fieldErrors);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'GET' }, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(
      path,
      { method: 'POST', body: body ? JSON.stringify(body) : undefined },
      options,
    ),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(
      path,
      { method: 'PATCH', body: body ? JSON.stringify(body) : undefined },
      options,
    ),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(
      path,
      { method: 'PUT', body: body ? JSON.stringify(body) : undefined },
      options,
    ),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'DELETE' }, options),
};