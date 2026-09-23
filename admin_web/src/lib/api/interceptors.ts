/**
 * Falcon Rider Admin Portal â€” Axios Interceptors
 *
 * Request interceptor: adds auth token, request ID
 * Response interceptor: handles 401, refresh, errors
 *
 * NOTE: The auth store is wired in later. This file defines
 * the interceptor architecture. Actual token retrieval is
 * injected via setAuthTokenGetter().
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { env } from '@/config/env';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// AUTH TOKEN GETTER (injected later)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type TokenGetter = () => string | null;
type LogoutHandler = () => void;
type RefreshHandler = () => Promise<string | null>;

let getAccessToken: TokenGetter = () => null;
let onLogout: LogoutHandler = () => {};
let onRefresh: RefreshHandler = async () => null;

/**
 * Wire auth store into interceptors.
 * Called once at app startup.
 */
export function configureAuthInterceptor(options: {
  getToken: TokenGetter;
  onLogout: LogoutHandler;
  onRefresh: RefreshHandler;
}) {
  getAccessToken = options.getToken;
  onLogout = options.onLogout;
  onRefresh = options.onRefresh;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REQUEST INTERCEPTOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Add request ID for traceability
    config.headers['X-Request-ID'] = generateRequestId();

    // Add client info
    config.headers['X-Client'] = 'admin-portal';
    config.headers['X-Client-Version'] = env.APP_VERSION;

    return config;
  },
  (error) => Promise.reject(error)
);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// RESPONSE INTERCEPTOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig;

    // Handle 401 â€” attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await onRefresh();
        if (newToken) {
          originalRequest.headers.Authorization = `Token ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed â€” logout
      }

      onLogout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle 403 â€” forbidden
    if (error.response?.status === 403) {
      // Optionally show toast â€” handled by consumer
    }

    // Handle 500+ â€” server error
    if (error.response && error.response.status >= 500) {
      // Optionally log to monitoring â€” handled by consumer
    }

    return Promise.reject(error);
  }
);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HELPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

