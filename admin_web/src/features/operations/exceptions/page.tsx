'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import { useExceptions, useResolveException } from '@/features/operations/hooks/use-operations';
import type { Exception, ExceptionListParams, ExceptionPriority, ExceptionType } from '@/features/operations/types/operations.types';
import { useDebounce } from '@/lib/hooks/use-debounce';

const PRIORITY_STYLES: Record<ExceptionPriority, string> = {
  CRITICAL: 'text-red-700 dark:text-red-400',
  HIGH: 'text-orange-700 dark:text-orange-400',
  MEDIUM: 'text-amber-700 dark:text-amber-400',
  LOW: 'text-muted-foreground',
};

const PRIORITY_OPTIONS: ExceptionPriority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function ExceptionsPage() {
  const [filters, setFilters] = useState<ExceptionListParams>({ page: 1, pageSize: 20 });
  const [target, setTarget] = useState<Exception | null>(null);
  const [resolution, setResolution] = useState('');
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useExceptions({ ...filters, search });
  const mutation = useResolveException();

  const columns: ColumnDef<Exception>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Exception',
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div className="max-w-md">
            <div className="truncate text-sm font-medium">{row.original.title}</div>
            <div className="truncate text-xs text-muted-foreground">{row.original.description}</div>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <span className="text-[10px] font-medium uppercase text-muted-foreground">
            {row.original.type.replace(/_/g, ' ')}
          </span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <span className={cn('text-xs font-semibold', PRIORITY_STYLES[row.original.priority])}>
            {row.original.priority}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
      },
      {
        id: 'entity',
        header: 'Entity',
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.entityLabel}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Age',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{formatRelativeTime(row.original.createdAt)}</span>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          if (row.original.status === 'RESOLVED') {
            return <span className="text-xs text-muted-foreground">—</span>;
          }
          return (
            <Button
              size="sm"
              variant="outline"
              className="h-7"
              onClick={(e) => {
                e.stopPropagation();
                setTarget(row.original);
              }}
            >
              Resolve
            </Button>
          );
        },
      },
    ],
    []
  );

  const handleResolve = async () => {
    if (!target) return;
    if (!resolution.trim()) {
      toast.error('Resolution required');
      return;
    }
    try {
      await mutation.mutateAsync({ id: target.id, resolution });
      toast.success('Exception resolved');
      setTarget(null);
      setResolution('');
    } catch {
      toast.error('Failed to resolve');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Exceptions" description="Operational exceptions requiring intervention" />

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
              placeholder="Search…"
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full sm:max-w-xs"
            />
            <Select
              value={filters.priority ?? 'all'}
              onValueChange={(v) =>
                setFilters({ ...filters, priority: v === 'all' ? undefined : (v as ExceptionPriority), page: 1 })
              }
            >
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {PRIORITY_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select
              value={filters.status ?? 'all'}
              onValueChange={(v) =>
                setFilters({ ...filters, status: v === 'all' ? undefined : (v as 'OPEN' | 'INVESTIGATING' | 'RESOLVED'), page: 1 })
              }
            >
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve exception</DialogTitle>
            <DialogDescription>
              {target?.id} · {target?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="resolution">Resolution notes</Label>
            <Textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              placeholder="Describe the resolution…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)} disabled={mutation.isPending}>Cancel</Button>
            <Button onClick={handleResolve} disabled={mutation.isPending}>
              {mutation.isPending ? 'Resolving…' : 'Resolve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}