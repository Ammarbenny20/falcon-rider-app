'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { reconciliationColumns } from '@/features/finance/components/reconciliation-table-columns';
import { useReconciliation } from '@/features/finance/hooks/use-finance';
import type { ReconciliationListParams, ReconciliationStatus } from '@/features/finance/types/finance.types';

const STATUS_OPTIONS: ReconciliationStatus[] = ['RECONCILED', 'EXCEPTION', 'PENDING'];

export default function ReconciliationPage() {
  const [filters, setFilters] = useState<ReconciliationListParams>({ page: 1, pageSize: 20 });
  const { data, isLoading, isError, error, refetch } = useReconciliation(filters);

  return (
    <div className="space-y-6">
      <PageHeader title="Reconciliation" description="Fare vs payment vs provider earning integrity" />

      <DataTable
        columns={reconciliationColumns}
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
          <Select
            value={filters.status ?? 'all'}
            onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as ReconciliationStatus), page: 1 })}
          >
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}