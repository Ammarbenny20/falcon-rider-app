'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { useAvailability } from '@/features/operations/hooks/use-operations';
import type { ProviderAvailability, AvailabilityListParams } from '@/features/operations/types/operations.types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { formatRelativeTime } from '@/lib/utils/format';

const columns: ColumnDef<ProviderAvailability>[] = [
  {
    accessorKey: 'providerName',
    header: 'Provider',
    cell: ({ row }) => (
      <Link href={`/people/providers/${row.original.providerId}`} className="flex flex-col hover:underline">
        <span className="text-sm font-medium">{row.original.providerName}</span>
        <span className="font-mono text-xs text-muted-foreground">{row.original.providerId}</span>
      </Link>
    ),
  },
  {
    accessorKey: 'capability',
    header: 'Capability',
    cell: ({ row }) => (
      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
        {row.original.capability}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) =>
      row.original.availability ? (
        <StatusBadgeAuto status={row.original.availability} />
      ) : row.original.journeyStatus ? (
        <StatusBadgeAuto status={row.original.journeyStatus} />
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: 'city',
    header: 'City',
    cell: ({ row }) => <span className="text-sm">{row.original.city}</span>,
  },
  {
    id: 'active',
    header: 'Active Trip',
    cell: ({ row }) =>
      row.original.activeTripId ? (
        <Link href={`/operations/trips/${row.original.activeTripId}`} className="font-mono text-xs text-blue-600 hover:underline">
          {row.original.activeTripId}
        </Link>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: 'lastSeenAt',
    header: 'Last Seen',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{formatRelativeTime(row.original.lastSeenAt)}</span>
    ),
  },
];

export default function AvailabilityPage() {
  const [filters, setFilters] = useState<AvailabilityListParams>({ page: 1, pageSize: 20 });
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useAvailability({ ...filters, search });

  return (
    <div className="space-y-6">
      <PageHeader title="Provider Availability" description="Professional availability and Community journey status — auto-refreshing every 30 seconds" />

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        page={filters.page ?? 1}
        pageSize={filters.pageSize ?? 20}
        pageCount={data?.totalPages ?? 1}
        totalItems={data?.totalItems ?? 0}
        onPageChange={(page) => setFilters({ ...filters, page })}
        onPageSizeChange={(pageSize) => setFilters({ ...filters, pageSize, page: 1 })}
        toolbar={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search provider…"
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full sm:max-w-xs"
            />
            <Select
              value={filters.capability ?? 'all'}
              onValueChange={(v) =>
                setFilters({ ...filters, capability: v === 'all' ? undefined : (v as 'PROFESSIONAL' | 'COMMUNITY'), page: 1 })
              }
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Capability" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All capabilities</SelectItem>
                <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                <SelectItem value="COMMUNITY">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}