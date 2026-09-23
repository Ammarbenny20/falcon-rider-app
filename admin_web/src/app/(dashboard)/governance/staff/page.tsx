'use client';

import { useState } from 'react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { useStaff } from '@/features/governance/hooks/use-governance';
import { ROLE_LABELS, type Role } from '@/config/permissions';
import type { StaffMember, StaffListParams } from '@/features/governance/types/governance.types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { formatRelativeTime, getInitials } from '@/lib/utils/format';

const columns: ColumnDef<StaffMember>[] = [
  {
    accessorKey: 'fullName',
    header: 'Staff Member',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs">{getInitials(row.original.fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{row.original.fullName}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant="outline">{ROLE_LABELS[row.original.role] ?? row.original.role}</Badge>
    ),
  },
  {
    id: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.permissions.length} permissions
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadgeAuto status={row.original.isActive ? 'ACTIVE' : 'INACTIVE'} />
    ),
  },
  {
    accessorKey: 'lastLoginAt',
    header: 'Last Login',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.lastLoginAt ? formatRelativeTime(row.original.lastLoginAt) : 'Never'}
      </span>
    ),
  },
];

export default function StaffPage() {
  const [filters, setFilters] = useState<StaffListParams>({ page: 1, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useStaff({ ...filters, search });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Members"
        description="Manage admin users, roles, and permissions"
      />

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
          <Input
            placeholder="Search staff…"
            value={filters.search ?? ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full sm:max-w-xs"
          />
        }
      />
    </div>
  );
}