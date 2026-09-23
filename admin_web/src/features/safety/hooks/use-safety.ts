'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { safetyApi } from '../api/safety.api';
import type {
  IncidentListParams, ReportListParams, EmergencyListParams,
  RestrictionListParams, AppealListParams, SupportListParams,
} from '../types/safety.types';

export const safetyKeys = {
  all: ['safety'] as const,
  overview: () => [...safetyKeys.all, 'overview'] as const,
  incidents: {
    all: () => [...safetyKeys.all, 'incidents'] as const,
    list: (p: IncidentListParams) => [...safetyKeys.incidents.all(), p] as const,
  },
  reports: {
    all: () => [...safetyKeys.all, 'reports'] as const,
    list: (p: ReportListParams) => [...safetyKeys.reports.all(), p] as const,
  },
  emergency: {
    all: () => [...safetyKeys.all, 'emergency'] as const,
    list: (p: EmergencyListParams) => [...safetyKeys.emergency.all(), p] as const,
  },
  restrictions: {
    all: () => [...safetyKeys.all, 'restrictions'] as const,
    list: (p: RestrictionListParams) => [...safetyKeys.restrictions.all(), p] as const,
  },
  appeals: {
    all: () => [...safetyKeys.all, 'appeals'] as const,
    list: (p: AppealListParams) => [...safetyKeys.appeals.all(), p] as const,
  },
  support: {
    all: () => [...safetyKeys.all, 'support'] as const,
    list: (p: SupportListParams) => [...safetyKeys.support.all(), p] as const,
  },
};

export function useSafetyOverview() {
  return useQuery({ queryKey: safetyKeys.overview(), queryFn: () => safetyApi.getOverview(), staleTime: 30_000 });
}

export function useIncidents(params: IncidentListParams = {}) {
  return useQuery({
    queryKey: safetyKeys.incidents.list(params),
    queryFn: () => safetyApi.listIncidents(params),
    placeholderData: (prev) => prev,
  });
}

export function useResolveIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      safetyApi.resolveIncident(id, resolution),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: safetyKeys.incidents.all() });
      qc.invalidateQueries({ queryKey: safetyKeys.overview() });
    },
  });
}

export function useReports(params: ReportListParams = {}) {
  return useQuery({ queryKey: safetyKeys.reports.list(params), queryFn: () => safetyApi.listReports(params), placeholderData: (p) => p });
}

export function useEmergency(params: EmergencyListParams = {}) {
  return useQuery({
    queryKey: safetyKeys.emergency.list(params),
    queryFn: () => safetyApi.listEmergency(params),
    placeholderData: (p) => p,
    refetchInterval: 20_000,
  });
}

export function useRestrictions(params: RestrictionListParams = {}) {
  return useQuery({ queryKey: safetyKeys.restrictions.list(params), queryFn: () => safetyApi.listRestrictions(params), placeholderData: (p) => p });
}

export function useLiftRestriction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => safetyApi.liftRestriction(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: safetyKeys.restrictions.all() }),
  });
}

export function useAppeals(params: AppealListParams = {}) {
  return useQuery({ queryKey: safetyKeys.appeals.list(params), queryFn: () => safetyApi.listAppeals(params), placeholderData: (p) => p });
}

export function useReviewAppeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, note }: { id: string; action: 'accept' | 'reject'; note: string }) =>
      safetyApi.reviewAppeal(id, action, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: safetyKeys.appeals.all() }),
  });
}

export function useSupport(params: SupportListParams = {}) {
  return useQuery({ queryKey: safetyKeys.support.list(params), queryFn: () => safetyApi.listSupport(params), placeholderData: (p) => p });
}