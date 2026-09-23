'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';
import type { AnalyticsParams } from '../types/analytics.types';

export const analyticsKeys = {
  all: ['analytics'] as const,
  marketplace: (p: AnalyticsParams) => [...analyticsKeys.all, 'marketplace', p] as const,
  mobility: (p: AnalyticsParams) => [...analyticsKeys.all, 'mobility', p] as const,
  providers: (p: AnalyticsParams) => [...analyticsKeys.all, 'providers', p] as const,
  customers: (p: AnalyticsParams) => [...analyticsKeys.all, 'customers', p] as const,
  journeys: (p: AnalyticsParams) => [...analyticsKeys.all, 'journeys', p] as const,
  finance: (p: AnalyticsParams) => [...analyticsKeys.all, 'finance', p] as const,
  geography: (p: AnalyticsParams) => [...analyticsKeys.all, 'geography', p] as const,
};

export function useMarketplaceMetrics(p: AnalyticsParams = {}) {
  return useQuery({ queryKey: analyticsKeys.marketplace(p), queryFn: () => analyticsApi.getMarketplace(p), staleTime: 60_000 });
}
export function useMobilityMetrics(p: AnalyticsParams = {}) {
  return useQuery({ queryKey: analyticsKeys.mobility(p), queryFn: () => analyticsApi.getMobility(p), staleTime: 60_000 });
}
export function useProviderMetrics(p: AnalyticsParams = {}) {
  return useQuery({ queryKey: analyticsKeys.providers(p), queryFn: () => analyticsApi.getProviders(p), staleTime: 60_000 });
}
export function useCustomerMetrics(p: AnalyticsParams = {}) {
  return useQuery({ queryKey: analyticsKeys.customers(p), queryFn: () => analyticsApi.getCustomers(p), staleTime: 60_000 });
}
export function useJourneyMetrics(p: AnalyticsParams = {}) {
  return useQuery({ queryKey: analyticsKeys.journeys(p), queryFn: () => analyticsApi.getJourneys(p), staleTime: 60_000 });
}
export function useFinanceMetrics(p: AnalyticsParams = {}) {
  return useQuery({ queryKey: analyticsKeys.finance(p), queryFn: () => analyticsApi.getFinance(p), staleTime: 60_000 });
}
export function useGeographyMetrics(p: AnalyticsParams = {}) {
  return useQuery({ queryKey: analyticsKeys.geography(p), queryFn: () => analyticsApi.getGeography(p), staleTime: 60_000 });
}