'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { formatDateTime } from '@/lib/utils/format';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface AuditLog {
  id: string;
  action: string;
  actorId?: string;
  actorName?: string;
  entityType?: string;
  entityId?: string;
  ip?: string;
  requestId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const columns: ColumnDef<AuditLog>[] = [
  { accessorKey: 'timestamp', header: 'When', cell: ({ row }) => <span className="text-xs">{formatDateTime(row.original.timestamp)}</span> },
  { accessorKey: 'actorName', header: 'Who', cell: ({ row }) => <span className="text-sm">{row.original.actorName ?? row.original.actorId ?? 'â€”'}</span> },
  { accessorKey: 'action', header: 'Action', cell: ({ row }) => <span className="font-mono text-xs">{row.original.action}</span> },
  { id: 'entity', header: 'Entity', cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span>{row.original.entityType ?? 'â€”'}</span>
        <span className="font-mono text-muted-foreground">{row.original.entityId ?? 'â€”'}</span>
      </div>
    ),
  },
  { accessorKey: 'ip', header: 'IP', cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.ip ?? 'â€”'}</span> },
  { accessorKey: 'requestId', header: 'Request ID', cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.requestId ?? 'â€”'}</span> },
];

const USE_MOCK = true;
const MOCK: AuditLog[] = [
  { id: 'AUD-1', action: 'admin.provider.approve', actorName: 'Ops Admin', entityType: 'PROVIDER', entityId: 'PR-00001', ip: '10.0.0.5', requestId: 'req-8271', timestamp: new Date(Date.now() - 6 * 60000).toISOString() },
  { id: 'AUD-2', action: 'admin.payment.refund', actorName: 'Finance Admin', entityType: 'PAYMENT', entityId: 'PY-00918', ip: '10.0.0.9', requestId: 'req-8270', timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'AUD-3', action: 'admin.user.suspend', actorName: 'Safety Admin', entityType: 'USER', entityId: 'CU-00091', ip: '10.0.0.12', requestId: 'req-8269', timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: 'AUD-4', action: 'auth.login', actorName: 'Ops Admin', entityType: 'USER', entityId: 'STAFF-002', ip: '10.0.0.5', requestId: 'req-8268', timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
];

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['audit-logs', debounced],
    queryFn: async () => {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        const items = MOCK.filter((l) =>
          !debounced ||
          l.action.toLowerCase().includes(debounced.toLowerCase()) ||
          l.actorName?.toLowerCase().includes(debounced.toLowerCase()) ||
          l.entityId?.toLowerCase().includes(debounced.toLowerCase())
        );
        return { results: items, totalItems: items.length, totalPages: 1 };
      }
      const { data } = await apiClient.get(ENDPOINTS.AUDIT.LOGS, {
        params: { page: 1, page_size: 50, search: debounced },
      });
      return { results: data.results, totalItems: data.count, totalPages: Math.ceil(data.count / 50) };
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" description="Every state-changing operation â€” immutable" />
      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        page={1}
        pageSize={50}
        pageCount={data?.totalPages ?? 1}
        totalItems={data?.totalItems ?? 0}
        onPageChange={() => {}}
        toolbar={
          <Input placeholder="Search action, actor, entityâ€¦" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:max-w-xs" />
        }
      />
    </div>
  );
}

