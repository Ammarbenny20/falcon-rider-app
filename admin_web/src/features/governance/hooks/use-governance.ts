'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { governanceApi } from '../api/governance.api';
import type { StaffListParams, UpdateSettingsPayload } from '../types/governance.types';

export const governanceKeys = {
  all: ['governance'] as const,
  staff: {
    all: () => [...governanceKeys.all, 'staff'] as const,
    list: (p: StaffListParams) => [...governanceKeys.staff.all(), p] as const,
  },
  roles: () => [...governanceKeys.all, 'roles'] as const,
  permissions: () => [...governanceKeys.all, 'permissions'] as const,
  settings: () => [...governanceKeys.all, 'settings'] as const,
};

export function useStaff(params: StaffListParams = {}) {
  return useQuery({
    queryKey: governanceKeys.staff.list(params),
    queryFn: () => governanceApi.listStaff(params),
    placeholderData: (p) => p,
  });
}

export function useRoles() {
  return useQuery({
    queryKey: governanceKeys.roles(),
    queryFn: () => governanceApi.listRoles(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: governanceKeys.permissions(),
    queryFn: () => governanceApi.listPermissions(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: governanceKeys.settings(),
    queryFn: () => governanceApi.getSettings(),
    staleTime: 60_000,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => governanceApi.updateSettings(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: governanceKeys.settings() }),
  });
}