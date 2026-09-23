'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { useJourneys, useJourneyTemplates } from '@/features/operations/hooks/use-operations';
import type { CommunityJourney, JourneyListParams, JourneyStatus, JourneyTemplate } from '@/features/operations/types/operations.types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { formatCurrency, formatDateTime, formatRelativeTime, humanizeStatus } from '@/lib/utils/format';

const STATUS_OPTIONS: JourneyStatus[] = [
  'DRAFT', 'PUBLISHED', 'MATCHING', 'CONFIRMED', 'LIVE', 'COMPLETED', 'CANCELLED', 'SKIPPED', 'EXPIRED',
];

const journeyColumns: ColumnDef<CommunityJourney>[] = [
  {
    accessorKey: 'id',
    header: 'Journey',
    cell: ({ row }) => (
      <Link href={`/operations/journeys/${row.original.id}`} className="font-mono text-sm font-medium hover:underline">
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: 'providerName',
    header: 'Provider',
    cell: ({ row }) => <span className="text-sm">{row.original.providerName}</span>,
  },
  {
    id: 'route',
    header: 'Route',
    cell: ({ row }) => (
      <div className="max-w-md text-xs">
        <div className="truncate">{row.original.originAddress}</div>
        <div className="truncate text-muted-foreground">→ {row.original.destinationAddress}</div>
      </div>
    ),
  },
  {
    accessorKey: 'departureAt',
    header: 'Departure',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{formatDateTime(row.original.departureAt)}</span>
    ),
  },
  {
    id: 'seats',
    header: 'Seats',
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {row.original.seatsBooked}/{row.original.seatsAvailable + row.original.seatsBooked}
      </span>
    ),
  },
  {
    id: 'cost',
    header: 'Cost/Seat',
    cell: ({ row }) => (
      <span className="tabular-nums text-xs">
        {formatCurrency(row.original.costPerSeat.amount, row.original.costPerSeat.currency)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
  },
  {
    id: 'recurring',
    header: 'Recurring',
    cell: ({ row }) =>
      row.original.isRecurring ? (
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          RECURRING
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
];

export default function JourneysPage() {
  const [filters, setFilters] = useState<JourneyListParams>({ page: 1, pageSize: 20 });
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useJourneys({ ...filters, search });
  const { data: templates, isLoading: templatesLoading } = useJourneyTemplates();

  return (
    <div className="space-y-6">
      <PageHeader title="Community Journeys" description="Published, recurring, and completed community journeys" />

      <Tabs defaultValue="journeys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="journeys">Journeys</TabsTrigger>
          <TabsTrigger value="templates">
            Templates {templates ? `(${templates.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journeys" className="space-y-4">
          <DataTable
            columns={journeyColumns}
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
                placeholder="Search journeys…"
                value={filters.search ?? ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full sm:max-w-xs"
              />
            }
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {templatesLoading ? (
            <div className="text-sm text-muted-foreground">Loading templates…</div>
          ) : !templates || templates.length === 0 ? (
            <EmptyState title="No templates" description="No recurring journey templates yet." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {templates.map((tpl) => (
                <TemplateCard key={tpl.id} template={tpl} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateCard({ template }: { template: JourneyTemplate }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {template.providerName} · {template.id}
            </p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            template.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-muted text-muted-foreground'
          }`}>
            {template.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-xs text-muted-foreground">
          {template.originAddress} → {template.destinationAddress}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Days</div>
            <div className="font-medium">{template.recurrenceDays.join(', ')}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Time</div>
            <div className="font-medium">{template.departureTime}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Seats</div>
            <div className="font-medium">{template.seatsAvailable}</div>
          </div>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Cost/seat: </span>
          <span className="font-medium">
            {formatCurrency(template.costPerSeat.amount, template.costPerSeat.currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}