'use client';

/**
 * Falcon Rider Admin Portal — Providers List Page
 */

import { useMemo, useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { ProviderFilters } from '@/features/providers/components/provider-filters';
import { getProviderColumns } from '@/features/providers/components/provider-table-columns';
import { VerificationActionDialog } from '@/features/providers/components/verification-action-dialog';
import { SuspendProviderDialog } from '@/features/providers/components/suspend-provider-dialog';
import { useProviders } from '@/features/providers/hooks/use-providers';
import type { Provider, ProviderListParams } from '@/features/providers/types/provider.types';
import type { SortingState } from '@tanstack/react-table';

export default function ProvidersPage() {
  const [filters, setFilters] = useState<ProviderListParams>({
    page: 1,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [verifyingProvider, setVerifyingProvider] = useState<Provider | null>(null);
  const [suspendingProvider, setSuspendingProvider] = useState<Provider | null>(null);

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 300);

  const queryParams: ProviderListParams = {
    ...filters,
    search: debouncedSearch,
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
  };

  const { data, isLoading, isError, error, refetch } = useProviders(queryParams);

  const columns = useMemo(
    () =>
      getProviderColumns({
        onVerify: (p) => setVerifyingProvider(p),
        onSuspend: (p) => setSuspendingProvider(p),
      }),
    []
  );

  const providers = data?.results ?? [];
  const totalItems = data?.totalItems ?? 0;
  const pageCount = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Providers"
        description="Manage Professional and Community providers across the marketplace."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Invite Provider
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={providers}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        page={filters.page ?? 1}
        pageSize={filters.pageSize ?? 20}
        pageCount={pageCount}
        totalItems={totalItems}
        onPageChange={(page) => setFilters({ ...filters, page })}
        onPageSizeChange={(pageSize) =>
          setFilters({ ...filters, pageSize, page: 1 })
        }
        sorting={sorting}
        onSortingChange={setSorting}
        toolbar={<ProviderFilters filters={filters} onChange={setFilters} />}
      />

      <VerificationActionDialog
        open={!!verifyingProvider}
        onOpenChange={(open) => !open && setVerifyingProvider(null)}
        provider={verifyingProvider}
      />

      <SuspendProviderDialog
        open={!!suspendingProvider}
        onOpenChange={(open) => !open && setSuspendingProvider(null)}
        provider={suspendingProvider}
      />
    </div>
  );
}