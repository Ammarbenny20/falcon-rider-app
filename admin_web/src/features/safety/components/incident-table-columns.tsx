'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { SafetyIncident, IncidentSeverity } from '../types/safety.types';

const SEV_STYLES: Record<IncidentSeverity, string> = {
  CRITICAL: 'text-red-700 dark:text-red-400',
  HIGH: 'text-orange-700 dark:text-orange-400',
  MEDIUM: 'text-amber-700 dark:text-amber-400',
  LOW: 'text-muted-foreground',
};

export function getIncidentColumns({
  onResolve,
}: {
  onResolve: (i: SafetyIncident) => void;
}): ColumnDef<SafetyIncident>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Incident',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-medium">{row.original.id}</span>
          <span className="text-xs text-muted-foreground">{row.original.type}</span>
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="max-w-md">
          <div className="truncate text-sm font-medium">{row.original.title}</div>
          <div className="truncate text-xs text-muted-foreground">{row.original.description}</div>
        </div>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => (
        <span className={cn('text-xs font-semibold', SEV_STYLES[row.original.severity])}>
          {row.original.severity}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
    },
    {
      id: 'who',
      header: 'Parties',
      cell: ({ row }) => (
        <div className="text-xs">
          {row.original.customerName && <div>ðŸ‘¤ {row.original.customerName}</div>}
          {row.original.providerName && <div>ðŸš— {row.original.providerName}</div>}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Reported',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const i = row.original;
        if (i.status === 'RESOLVED' || i.status === 'CLOSED') {
          return (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {i.status}
            </span>
          );
        }
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7"
            onClick={(e) => {
              e.stopPropagation();
              onResolve(i);
            }}
          >
            <AlertTriangle className="mr-1 h-3.5 w-3.5" />
            Resolve
          </Button>
        );
      },
    },
  ];
}

