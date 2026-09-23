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
import { useBookings } from '@/features/operations/hooks/use-operations';
import type { Booking, BookingListParams, BookingStatus } from '@/features/operations/types/operations.types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';

const STATUS_OPTIONS: BookingStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'id',
    header: 'Booking',
    cell: ({ row }) => (
      <Link href={`/operations/bookings/${row.original.id}`} className="font-mono text-sm font-medium hover:underline">
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => <span className="text-sm">{row.original.customerName}</span>,
  },
  {
    accessorKey: 'providerName',
    header: 'Provider',
    cell: ({ row }) =>
      row.original.providerName ?? <span className="text-xs text-muted-foreground">—</span>,
  },
  {
    accessorKey: 'seats',
    header: 'Seats',
    cell: ({ row }) => <span className="tabular-nums">{row.original.seats}</span>,
  },
  {
    id: 'fare',
    header: 'Fare',
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.fare.amount, row.original.fare.currency)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{formatRelativeTime(row.original.createdAt)}</span>
    ),
  },
];

export default function BookingsPage() {
  const [filters, setFilters] = useState<BookingListParams>({ page: 1, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useBookings({ ...filters, search });

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" description="All bookings across the marketplace" />

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
              placeholder="Search bookings…"
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full sm:max-w-xs"
            />
            <Select
              value={filters.status ?? 'all'}
              onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as BookingStatus), page: 1 })}
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}