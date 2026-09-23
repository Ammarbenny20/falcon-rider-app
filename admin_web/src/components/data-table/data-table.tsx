'use client';

/**
 * Falcon Rider Admin Portal — Data Table
 *
 * Reusable, headless, server-side data table.
 * Used across all admin tables (providers, customers, trips, payments, etc.)
 *
 * Features:
 * - Server-side pagination, sorting, filtering
 * - Column visibility control
 * - Row selection (optional)
 * - Loading skeleton
 * - Empty state
 * - Error state
 * - Optional row click navigation
 */

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/loading-state';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { cn } from '@/lib/utils/cn';
import { DataTablePagination } from './data-table-pagination';

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  emptyState?: React.ReactNode;
  toolbar?: React.ReactNode;

  // Server-side controls
  pageCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  totalItems?: number;

  /**
   * Optional row click navigation.
   * Returns the href for each row — if provided, rows become clickable.
   */
  getRowHref?: (row: TData) => string;
}

// ─────────────────────────────────────────
// DATA TABLE
// ─────────────────────────────────────────

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
  error,
  onRetry,
  emptyState,
  toolbar,
  pageCount = 1,
  page = 1,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  sorting: externalSorting,
  onSortingChange: externalSortingChange,
  columnFilters: externalFilters,
  onColumnFiltersChange: externalFiltersChange,
  totalItems = 0,
  getRowHref,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalFilters, setInternalFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const sorting = externalSorting ?? internalSorting;
  const setSorting = externalSortingChange ?? setInternalSorting;
  const columnFilters = externalFilters ?? internalFilters;
  const setColumnFilters = externalFiltersChange ?? setInternalFilters;

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex: page - 1, pageSize },
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
    },
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(next);
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  // ─────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────

  if (isError) {
    return (
      <ErrorState
        title="Failed to load data"
        description="We couldn't fetch the data. Please try again."
        error={error}
        onRetry={onRetry}
      />
    );
  }

  // ─────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border">
          <div className="border-b bg-muted/30 p-4">
            <Skeleton className="h-6 w-full max-w-md" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // EMPTY STATE
  // ─────────────────────────────────────────

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border">
        {toolbar && <div className="border-b p-4">{toolbar}</div>}
        {emptyState ?? (
          <EmptyState
            title="No records found"
            description="Try adjusting your search or filters."
          />
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────

  const isClickable = !!getRowHref;

  return (
    <div className="space-y-4">
      {toolbar && <div>{toolbar}</div>}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder ? null : canSort ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-3 h-8 data-[state=open]:bg-accent"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : sorted === 'desc' ? (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />
                          )}
                        </Button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const href = getRowHref ? getRowHref(row.original) : undefined;

              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    'transition-colors hover:bg-muted/50',
                    isClickable && 'cursor-pointer'
                  )}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={
                    href
                      ? (e) => {
                          // Avoid navigating if user clicked a button/link inside the row
                          const target = e.target as HTMLElement;
                          if (target.closest('a, button')) return;
                          router.push(href);
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {onPageChange && (
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          pageCount={pageCount}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}