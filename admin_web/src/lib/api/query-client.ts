/**
 * Falcon Rider Admin Portal — Query Client
 *
 * TanStack Query configuration.
 * Centralizes caching, retry, and refetch behavior.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** Data stays fresh for 30 seconds */
      staleTime: 30 * 1000,

      /** Cache kept for 5 minutes after unused */
      gcTime: 5 * 60 * 1000,

      /** Retry once on failure */
      retry: 1,

      /** Don't refetch on window focus (admin portal is long-lived) */
      refetchOnWindowFocus: false,

      /** Refetch on reconnect */
      refetchOnReconnect: true,

      /** Don't refetch on mount if data is fresh */
      refetchOnMount: true,
    },
    mutations: {
      /** Don't retry mutations (side effects) */
      retry: 0,
    },
  },
});

export default queryClient;