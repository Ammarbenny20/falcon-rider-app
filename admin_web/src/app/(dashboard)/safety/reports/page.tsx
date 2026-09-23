'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatRelativeTime, humanizeStatus } from '@/lib/utils/format';
import { useReports } from '@/features/safety/hooks/use-safety';
import type { Report, ReportListParams } from '@/features/safety/types/safety.types';
import { useDebounce } from '@/lib/hooks/use-debounce';

const columns: ColumnDef<Report>[] = [
  { accessorKey: 'id', header: 'Report', cell: ({ row }) => <span className="font-mono text-sm">{row.original.id}</span> },
  { accessorKey: 'category', header: 'Category', cell: ({ row }) => <span className="text-xs">{humanizeStatus(row.original.category)}</span> },
  { id: 'reporter', header: 'Reporter', cell: ({ row }) => (<div className="text-xs"><div>{row.original.reporterName}</div><div className="text-muted-foreground">{row.original.reporterRole}</div></div>) },
  { id: 'reported', header: 'Reported', cell: ({ row }) => (<div className="text-xs"><div>{row.original.reportedName}</div><div className="text-muted-foreground">{row.original.reportedRole}</div></div>) },
  { accessorKey: 'description', header: 'Description', cell: ({ row }) => <span className="text-xs line-clamp-2 max-w-md">{row.original.description}</span> },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadgeAuto status={row.original.status} /> },
  { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatRelativeTime(row.original.createdAt)}</span> },
];

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportListParams>({ page: 1, pageSize: 20 });
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useReports({ ...filters, search });

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Customer and provider reports" />
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
        toolbar={<Input placeholder="Searchâ€¦" value={filters.search ?? ''} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="w-full sm:max-w-xs" />}
      />
    </div>
  );
}

