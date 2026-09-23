'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { receiptColumns } from '@/features/finance/components/receipt-table-columns';
import { useReceipts } from '@/features/finance/hooks/use-finance';
import type { ReceiptListParams } from '@/features/finance/types/finance.types';
import { useDebounce } from '@/lib/hooks/use-debounce';

export default function ReceiptsPage() {
  const [filters, setFilters] = useState<ReceiptListParams>({ page: 1, pageSize: 20 });
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useReceipts({ ...filters, search });

  return (
    <div className="space-y-6">
      <PageHeader title="Receipts" description="Backend-generated receipts for every completed trip" />

      <DataTable
        columns={receiptColumns}
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
          <Input
            placeholder="Search by ID, customer, trip…"
            value={filters.search ?? ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full sm:max-w-xs"
          />
        }
      />
    </div>
  );
}