'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatDate, humanizeStatus } from '@/lib/utils/format';
import { useRestrictions, useLiftRestriction } from '@/features/safety/hooks/use-safety';
import type { Restriction, RestrictionListParams } from '@/features/safety/types/safety.types';

export default function RestrictionsPage() {
  const [filters, setFilters] = useState<RestrictionListParams>({ page: 1, pageSize: 20 });
  const { data, isLoading, isError, error, refetch } = useRestrictions(filters);
  const mutation = useLiftRestriction();

  const handleLift = async (r: Restriction) => {
    try {
      await mutation.mutateAsync({ id: r.id, reason: 'Lifted by operator' });
      toast.success('Restriction lifted');
    } catch {
      toast.error('Failed');
    }
  };

  const columns: ColumnDef<Restriction>[] = [
    { accessorKey: 'id', header: 'Restriction', cell: ({ row }) => <span className="font-mono text-sm">{row.original.id}</span> },
    { accessorKey: 'subjectName', header: 'Subject', cell: ({ row }) => (<div className="flex flex-col"><span className="text-sm font-medium">{row.original.subjectName}</span><span className="text-xs text-muted-foreground">{row.original.subjectRole}</span></div>) },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <span className="text-xs">{humanizeStatus(row.original.type)}</span> },
    { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => <span className="text-xs max-w-md line-clamp-2">{row.original.reason}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadgeAuto status={row.original.status} /> },
    { id: 'expires', header: 'Expires', cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.expiresAt ? formatDate(row.original.expiresAt) : 'â€”'}</span> },
    { id: 'actions', cell: ({ row }) => (
        row.original.status === 'ACTIVE' ? (
          <Button size="sm" variant="outline" className="h-7" onClick={(e) => { e.stopPropagation(); handleLift(row.original); }} disabled={mutation.isPending}>
            Lift
          </Button>
        ) : <span className="text-xs text-muted-foreground">â€”</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Restrictions" description="Account restrictions â€” suspensions, warnings, bans" />
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

