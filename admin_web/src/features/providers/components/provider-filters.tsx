'use client';

/**
 * Falcon Rider Admin Portal — Provider Filters
 *
 * Toolbar filters for provider list.
 */

import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  ProviderListParams,
  ProviderAccountStatus,
  CapabilityStatus,
} from '../types/provider.types';

interface ProviderFiltersProps {
  filters: ProviderListParams;
  onChange: (filters: ProviderListParams) => void;
}

const ACCOUNT_STATUSES: ProviderAccountStatus[] = [
  'PENDING_VERIFICATION',
  'ACTIVE',
  'SUSPENDED',
  'DEACTIVATED',
];

const CAPABILITY_STATUSES: CapabilityStatus[] = [
  'NOT_REQUESTED',
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
  'SUSPENDED',
];

export function ProviderFilters({ filters, onChange }: ProviderFiltersProps) {
  const hasFilters =
    !!filters.search ||
    !!filters.accountStatus ||
    !!filters.professionalCapability ||
    !!filters.communityCapability;

  const clear = () => {
    onChange({ page: 1, pageSize: filters.pageSize ?? 20 });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search by name, phone, email, or ID…"
        value={filters.search ?? ''}
        onChange={(e) =>
          onChange({ ...filters, search: e.target.value, page: 1 })
        }
        className="w-full sm:max-w-xs"
      />

      <Select
        value={filters.accountStatus ?? 'all'}
        onValueChange={(value) =>
          onChange({
            ...filters,
            accountStatus:
              value === 'all' ? undefined : (value as ProviderAccountStatus),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Account status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All accounts</SelectItem>
          {ACCOUNT_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.professionalCapability ?? 'all'}
        onValueChange={(value) =>
          onChange({
            ...filters,
            professionalCapability:
              value === 'all' ? undefined : (value as CapabilityStatus),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Professional" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All professional</SelectItem>
          {CAPABILITY_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.communityCapability ?? 'all'}
        onValueChange={(value) =>
          onChange({
            ...filters,
            communityCapability:
              value === 'all' ? undefined : (value as CapabilityStatus),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Community" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All community</SelectItem>
          {CAPABILITY_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clear}>
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}