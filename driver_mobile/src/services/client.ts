/**
 * Falcon Rider — API Client (Driver App)
 *
 * Centralized axios instance.
 * Base URL from config/env.ts
 */

import axios from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth.store';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─────────────────────────────────────────
// REQUEST INTERCEPTOR
// ─────────────────────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ─────────────────────────────────────────
// RESPONSE INTERCEPTOR
// ─────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);
