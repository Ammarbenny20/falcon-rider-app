'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ShieldAlert, MapPin, Phone } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatRelativeTime } from '@/lib/utils/format';
import { useEmergency } from '@/features/safety/hooks/use-safety';
import type { EmergencyEvent, EmergencyListParams } from '@/features/safety/types/safety.types';

const columns: ColumnDef<EmergencyEvent>[] = [
  { accessorKey: 'id', header: 'Event', cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.id}</span> },
  { accessorKey: 'customerName', header: 'Customer', cell: ({ row }) => <span className="text-sm">{row.original.customerName}</span> },
  { accessorKey: 'providerName', header: 'Provider', cell: ({ row }) => <span className="text-sm">{row.original.providerName ?? 'â€”'}</span> },
  { id: 'trip', header: 'Trip', cell: ({ row }) => <span className="font-mono text-xs">{row.original.tripId ?? 'â€”'}</span> },
  { id: 'location', header: 'Location', cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {row.original.location.address ?? `${row.original.location.lat.toFixed(3)}, ${row.original.location.lng.toFixed(3)}`}
      </div>
    ),
  },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadgeAuto status={row.original.status} /> },
  { accessorKey: 'triggeredAt', header: 'Triggered', cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatRelativeTime(row.original.triggeredAt)}</span> },
];

export default function EmergencyPage() {
  const [filters, setFilters] = useState<EmergencyListParams>({ page: 1, pageSize: 20 });
  const { data, isLoading, isError, error, refetch } = useEmergency(filters);

  return (
    <div className="space-y-6">
      <PageHeader title="Emergency Events" description="SOS alerts and emergency triage â€” auto-refreshing" />
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
      />
    </div>
  );
}

