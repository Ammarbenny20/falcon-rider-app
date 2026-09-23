'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatRelativeTime } from '@/lib/utils/format';
import { useAppeals, useReviewAppeal } from '@/features/safety/hooks/use-safety';
import type { Appeal, AppealListParams } from '@/features/safety/types/safety.types';

export default function AppealsPage() {
  const [filters, setFilters] = useState<AppealListParams>({ page: 1, pageSize: 20 });
  const [action, setAction] = useState<{ appeal: Appeal; mode: 'accept' | 'reject' } | null>(null);
  const [note, setNote] = useState('');
  const { data, isLoading, isError, error, refetch } = useAppeals(filters);
  const mutation = useReviewAppeal();

  const handleSubmit = async () => {
    if (!action) return;
    try {
      await mutation.mutateAsync({ id: action.appeal.id, action: action.mode, note });
      toast.success(`Appeal ${action.mode}ed`);
      setAction(null);
      setNote('');
    } catch {
      toast.error('Failed');
    }
  };

  const columns: ColumnDef<Appeal>[] = [
    { accessorKey: 'id', header: 'Appeal', cell: ({ row }) => <span className="font-mono text-sm">{row.original.id}</span> },
    { accessorKey: 'subjectName', header: 'Subject', cell: ({ row }) => (<div className="flex flex-col"><span className="text-sm font-medium">{row.original.subjectName}</span><span className="text-xs text-muted-foreground">{row.original.subjectRole}</span></div>) },
    { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => <span className="text-xs max-w-md line-clamp-2">{row.original.reason}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadgeAuto status={row.original.status} /> },
    { accessorKey: 'submittedAt', header: 'Submitted', cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatRelativeTime(row.original.submittedAt)}</span> },
    { id: 'actions', cell: ({ row }) => {
        if (row.original.status !== 'PENDING' && row.original.status !== 'UNDER_REVIEW') return <span className="text-xs text-muted-foreground">â€”</span>;
        return (
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7" onClick={(e) => { e.stopPropagation(); setAction({ appeal: row.original, mode: 'accept' }); }}>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />Accept
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-destructive" onClick={(e) => { e.stopPropagation(); setAction({ appeal: row.original, mode: 'reject' }); }}>
              <XCircle className="mr-1 h-3.5 w-3.5" />Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Appeals" description="Restriction appeals â€” review and decide" />
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

      <Dialog open={!!action} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action?.mode === 'accept' ? 'Accept appeal' : 'Reject appeal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Note</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending ? 'Processingâ€¦' : action?.mode === 'accept' ? 'Accept' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

