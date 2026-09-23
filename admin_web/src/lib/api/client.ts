/**
 * Falcon Rider Admin Portal — API Client
 *
 * Centralized Axios instance for all backend communication.
 * - Base URL from environment
 * - Request/response interceptors (see interceptors.ts)
 * - Timeout configuration
 * - Credentials handling
 */

import axios, { type AxiosInstance } from 'axios';
import { env } from '@/config/env';

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

export default apiClient;