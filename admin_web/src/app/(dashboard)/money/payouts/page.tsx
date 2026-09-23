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
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { getPayoutColumns } from '@/features/finance/components/payout-table-columns';
import { usePayouts, useApprovePayout } from '@/features/finance/hooks/use-finance';
import type { Payout, PayoutListParams, PayoutStatus } from '@/features/finance/types/finance.types';
import { useDebounce } from '@/lib/hooks/use-debounce';

const STATUS_OPTIONS: PayoutStatus[] = ['PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'FAILED', 'REJECTED'];

export default function PayoutsPage() {
  const [filters, setFilters] = useState<PayoutListParams>({ page: 1, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [confirmTarget, setConfirmTarget] = useState<Payout | null>(null);

  const search = useDebounce(filters.search, 300);
  const params = { ...filters, search };

  const { data, isLoading, isError, error, refetch } = usePayouts(params);
  const approveMutation = useApprovePayout();

  const columns = useMemo(
    () => getPayoutColumns({ onApprove: (p) => setConfirmTarget(p) }),
    []
  );

  const handleApprove = async () => {
    if (!confirmTarget) return;
    try {
      await approveMutation.mutateAsync(confirmTarget.id);
      toast.success('Payout approved');
      setConfirmTarget(null);
    } catch {
      toast.error('Approval failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Payouts" description="Provider payouts — review and approve" />

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
              placeholder="Search by ID, provider…"
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full sm:max-w-xs"
            />
            <Select
              value={filters.status ?? 'all'}
              onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as PayoutStatus), page: 1 })}
            >
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <ConfirmDialog
        open={!!confirmTarget}
        onOpenChange={(o) => !o && setConfirmTarget(null)}
        title="Approve payout"
        description={`Approve payout ${confirmTarget?.id} to ${confirmTarget?.providerName}?`}
        confirmLabel="Approve"
        onConfirm={handleApprove}
        isLoading={approveMutation.isPending}
      />
    </div>
  );
}