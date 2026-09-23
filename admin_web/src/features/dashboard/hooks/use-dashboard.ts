'use client';

/**
 * Falcon Rider Admin Portal — Dashboard Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  commandCenter: () => [...dashboardKeys.all, 'command-center'] as const,
  liveOps: () => [...dashboardKeys.all, 'live-ops'] as const,
  actionItems: () => [...dashboardKeys.all, 'action-items'] as const,
  keyMetrics: () => [...dashboardKeys.all, 'key-metrics'] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
  mapData: () => [...dashboardKeys.all, 'map'] as const,
};

export function useCommandCenter() {
  return useQuery({
    queryKey: dashboardKeys.commandCenter(),
    queryFn: () => dashboardApi.getCommandCenter(),
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000, // auto-refresh every 30s
  });
}

export function useLiveOperations() {
  return useQuery({
    queryKey: dashboardKeys.liveOps(),
    queryFn: () => dashboardApi.getLiveOperations(),
    staleTime: 15 * 1000,
    refetchInterval: 15 * 1000,
  });
}

export function useActionItems() {
  return useQuery({
    queryKey: dashboardKeys.actionItems(),
    queryFn: () => dashboardApi.getActionItems(),
    staleTime: 20 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useKeyMetrics() {
  return useQuery({
    queryKey: dashboardKeys.keyMetrics(),
    queryFn: () => dashboardApi.getKeyMetrics(),
    staleTime: 60 * 1000,
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: dashboardKeys.activity(),
    queryFn: () => dashboardApi.getActivityFeed(),
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useMapData() {
  return useQuery({
    queryKey: dashboardKeys.mapData(),
    queryFn: () => dashboardApi.getMapData(),
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });
}