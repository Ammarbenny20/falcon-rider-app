'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatRelativeTime, humanizeStatus } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { SupportCase, SupportPriority } from '../types/safety.types';

const PRIORITY_STYLES: Record<SupportPriority, string> = {
  URGENT: 'text-red-700 dark:text-red-400',
  HIGH: 'text-orange-700 dark:text-orange-400',
  MEDIUM: 'text-amber-700 dark:text-amber-400',
  LOW: 'text-muted-foreground',
};

export const supportColumns: ColumnDef<SupportCase>[] = [
  {
    accessorKey: 'id',
    header: 'Case',
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">{row.original.id}</span>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <div className="max-w-md">
        <div className="truncate text-sm font-medium">{row.original.subject}</div>
        <div className="truncate text-xs text-muted-foreground">{row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <span className="text-xs">{row.original.category}</span>,
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <span className={cn('text-xs font-semibold', PRIORITY_STYLES[row.original.priority])}>
        {row.original.priority}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
  },
  {
    id: 'sla',
    header: 'SLA',
    cell: ({ row }) => {
      if (!row.original.slaDeadline) return <span className="text-xs text-muted-foreground">â€”</span>;
      const overdue = new Date(row.original.slaDeadline) < new Date();
      return (
        <span className={cn('text-xs', overdue ? 'text-red-600 font-medium' : 'text-muted-foreground')}>
          {overdue ? 'OVERDUE' : formatRelativeTime(row.original.slaDeadline)}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatRelativeTime(row.original.createdAt)}
      </span>
    ),
  },
];

