'use client';

/**
 * Falcon Rider Admin Portal — Provider Hooks
 *
 * TanStack Query hooks for provider data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providersApi } from '../api/providers.api';
import type {
  ProviderListParams,
  ProviderVerificationAction,
} from '../types/provider.types';

// ─────────────────────────────────────────
// QUERY KEYS
// ─────────────────────────────────────────

export const providerKeys = {
  all: ['providers'] as const,
  lists: () => [...providerKeys.all, 'list'] as const,
  list: (params: ProviderListParams) => [...providerKeys.lists(), params] as const,
  details: () => [...providerKeys.all, 'detail'] as const,
  detail: (id: string) => [...providerKeys.details(), id] as const,
};

// ─────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────

/**
 * List providers with pagination, filters, sorting.
 */
export function useProviders(params: ProviderListParams = {}) {
  return useQuery({
    queryKey: providerKeys.list(params),
    queryFn: () => providersApi.list(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

/**
 * Get provider 360.
 */
export function useProvider(id: string | undefined) {
  return useQuery({
    queryKey: providerKeys.detail(id ?? ''),
    queryFn: () => providersApi.detail(id!),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

// ─────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────

/**
 * Verify (approve/reject) a provider capability.
 */
export function useVerifyProviderCapability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: ProviderVerificationAction) =>
      providersApi.verifyCapability(action),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: providerKeys.detail(variables.providerId),
      });
      queryClient.invalidateQueries({ queryKey: providerKeys.lists() });
    },
  });
}

/**
 * Suspend provider.
 */
export function useSuspendProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      providersApi.suspend(id, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: providerKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: providerKeys.lists() });
    },
  });
}