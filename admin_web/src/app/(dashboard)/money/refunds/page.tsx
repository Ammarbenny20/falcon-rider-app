'use client';

import { useMemo, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { getRefundColumns } from '@/features/finance/components/refund-table-columns';
import { RefundActionDialog } from '@/features/finance/components/refund-action-dialog';
import { useRefunds } from '@/features/finance/hooks/use-finance';
import type { Refund, RefundListParams, RefundStatus } from '@/features/finance/types/finance.types';
import { useDebounce } from '@/lib/hooks/use-debounce';

const STATUS_OPTIONS: RefundStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'FAILED'];

export default function RefundsPage() {
  const [filters, setFilters] = useState<RefundListParams>({ page: 1, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [action, setAction] = useState<{ refund: Refund; mode: 'APPROVE' | 'REJECT' } | null>(null);

  const search = useDebounce(filters.search, 300);
  const params = { ...filters, search, sortBy: sorting[0]?.id, sortDirection: sorting[0]?.desc ? 'desc' as const : 'asc' as const };

  const { data, isLoading, isError, error, refetch } = useRefunds(params);

  const columns = useMemo(
    () =>
      getRefundColumns({
        onApprove: (r) => setAction({ refund: r, mode: 'APPROVE' }),
        onReject: (r) => setAction({ refund: r, mode: 'REJECT' }),
      }),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Refunds" description="Refund workflow — request, review, approve or reject" />

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
              onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as RefundStatus), page: 1 })}
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

      <RefundActionDialog
        open={!!action}
        onOpenChange={(o) => !o && setAction(null)}
        refund={action?.refund ?? null}
        mode={action?.mode ?? 'APPROVE'}
      />
    </div>
  );
}