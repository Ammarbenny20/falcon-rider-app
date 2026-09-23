'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supportColumns } from '@/features/safety/components/support-table-columns';
import { useSupport } from '@/features/safety/hooks/use-safety';
import type { SupportListParams, SupportStatus } from '@/features/safety/types/safety.types';
import { useDebounce } from '@/lib/hooks/use-debounce';

const STATUS_OPTIONS: SupportStatus[] = ['OPEN', 'ASSIGNED', 'WAITING_FOR_CUSTOMER', 'WAITING_FOR_PROVIDER', 'ESCALATED', 'RESOLVED', 'CLOSED'];

export default function SupportPage() {
  const [filters, setFilters] = useState<SupportListParams>({ page: 1, pageSize: 20 });
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useSupport({ ...filters, search });

  return (
    <div className="space-y-6">
      <PageHeader title="Support Cases" description="Customer and provider support cases" />
      <DataTable
        columns={supportColumns}
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
            <Input placeholder="Search…" value={filters.search ?? ''} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="w-full sm:max-w-xs" />
            <Select value={filters.status ?? 'all'} onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as SupportStatus), page: 1 })}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}