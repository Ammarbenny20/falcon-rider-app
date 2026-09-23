'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { useRequests } from '@/features/operations/hooks/use-operations';
import type { RideRequest, RequestListParams, RequestStatus } from '@/features/operations/types/operations.types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';

const STATUS_OPTIONS: RequestStatus[] = ['REQUESTED', 'SEARCHING', 'MATCHED', 'EXPIRED', 'CANCELLED', 'NO_MATCH'];

const columns: ColumnDef<RideRequest>[] = [
  {
    accessorKey: 'id',
    header: 'Request',
    cell: ({ row }) => (
      <Link href={`/operations/requests/${row.original.id}`} className="font-mono text-sm font-medium hover:underline">
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original.customerName}</span>
        <span className="text-xs text-muted-foreground">{row.original.customerPhone}</span>
      </div>
    ),
  },
  {
    id: 'route',
    header: 'Route',
    cell: ({ row }) => (
      <div className="max-w-md text-xs">
        <div className="truncate">{row.original.originAddress}</div>
        <div className="truncate text-muted-foreground">→ {row.original.destinationAddress}</div>
      </div>
    ),
  },
  {
    id: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 text-xs">
        <span>{row.original.bookingType}</span>
        <span className="text-muted-foreground">{row.original.rideAccessType} · {row.original.transportMode}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
  },
  {
    id: 'provider',
    header: 'Provider',
    cell: ({ row }) =>
      row.original.providerName ? (
        <span className="text-sm">{row.original.providerName}</span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  {
    id: 'fare',
    header: 'Fare',
    cell: ({ row }) =>
      row.original.fareEstimate ? (
        <span className="tabular-nums">
          {formatCurrency(row.original.fareEstimate.amount, row.original.fareEstimate.currency)}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Age',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{formatRelativeTime(row.original.createdAt)}</span>
    ),
  },
];

export default function RequestsPage() {
  const [filters, setFilters] = useState<RequestListParams>({ page: 1, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useRequests({ ...filters, search });

  return (
    <div className="space-y-6">
      <PageHeader title="Ride Requests" description="Customer requests across the marketplace" />

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
        sorting={sorting}
        onSortingChange={setSorting}
        toolbar={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search by ID, customer, route…"
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full sm:max-w-xs"
            />
            <Select
              value={filters.status ?? 'all'}
              onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as RequestStatus), page: 1 })}
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}