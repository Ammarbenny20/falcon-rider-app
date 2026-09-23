'use client';

import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/operations.api';

export const customerKeys = {
  all: ['customers'] as const,
  detail: (id: string) => [...customerKeys.all, 'detail', id] as const,
};

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id ?? ''),
    queryFn: () => customerApi.detail(id!),
    enabled: !!id,
  });
}