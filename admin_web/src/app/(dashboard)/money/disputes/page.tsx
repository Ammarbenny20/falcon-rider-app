'use client';

import { useMemo, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getDisputeColumns } from '@/features/finance/components/dispute-table-columns';
import { useDisputes, useResolveDispute } from '@/features/finance/hooks/use-finance';
import type { Dispute, DisputeListParams, DisputeStatus } from '@/features/finance/types/finance.types';
import { useDebounce } from '@/lib/hooks/use-debounce';

const STATUS_OPTIONS: DisputeStatus[] = ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'];

export default function DisputesPage() {
  const [filters, setFilters] = useState<DisputeListParams>({ page: 1, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [target, setTarget] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState('');

  const search = useDebounce(filters.search, 300);
  const params = { ...filters, search };

  const { data, isLoading, isError, error, refetch } = useDisputes(params);
  const resolveMutation = useResolveDispute();

  const columns = useMemo(() => getDisputeColumns({ onResolve: setTarget }), []);

  const handleResolve = async () => {
    if (!target) return;
    if (!resolution.trim()) {
      toast.error('Resolution required');
      return;
    }
    try {
      await resolveMutation.mutateAsync({ id: target.id, resolution });
      toast.success('Dispute resolved');
      setTarget(null);
      setResolution('');
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Disputes" description="Customer disputes — investigate and resolve" />

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
              placeholder="Search…"
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full sm:max-w-xs"
            />
            <Select
              value={filters.status ?? 'all'}
              onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as DisputeStatus), page: 1 })}
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve dispute</DialogTitle>
            <DialogDescription>{target?.id} · {target?.customerName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="resolution">Resolution</Label>
            <Textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              placeholder="Describe the resolution…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)} disabled={resolveMutation.isPending}>Cancel</Button>
            <Button onClick={handleResolve} disabled={resolveMutation.isPending}>
              {resolveMutation.isPending ? 'Resolving…' : 'Resolve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}