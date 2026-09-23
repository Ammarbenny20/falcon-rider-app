// src/services/api/client.ts

import { env } from '@/config/env';
import { ApiError } from '@/services/api/errors';
import type { RequestOptions } from '@/services/api/types';
import { sessionStorage } from '@/features/auth/services/session-storage.service';

export { ApiError };

let refreshPromise: Promise<unknown> | null = null;

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

async function attemptRefresh(): Promise<void> {
  if (refreshPromise) {
    await refreshPromise;
    return;
  }
  return;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  requestOptions: RequestOptions = {},
  isRetry: boolean = false,
): Promise<T> {
  // Read token from sessionStorage (which writes to SecureStore)
  let token: string | null = null;
  try {
    const session = await sessionStorage.getSession();
    token = session?.accessToken ?? null;
  } catch {
    token = null;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (!requestOptions.skipAuth && token) {
    headers.Authorization = `Token ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    if (__DEV__) {
      console.warn('[apiClient] network error', path, networkError);
    }
    throw new ApiError(
      0,
      "We couldn't connect to Falcon Rider. Check your connection and try again.",
    );
  }

  if (response.status === 401 && !isRetry && !requestOptions.skipAuth) {
    await attemptRefresh();

    try {
      await sessionStorage.clearSession();
    } catch {
      // Non-fatal
    }

    const body = await response.json().catch(() => null);
    const { message } = extractErrorMessage(body);
    throw new ApiError(401, message || 'Please log in again to continue.');
  }

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
