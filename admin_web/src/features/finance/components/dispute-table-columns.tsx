'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatCurrency, formatDateTime, humanizeStatus } from '@/lib/utils/format';
import type { Dispute } from '../types/finance.types';

export function getDisputeColumns({
  onResolve,
}: {
  onResolve: (d: Dispute) => void;
}): ColumnDef<Dispute>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Dispute',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.customerName}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="text-xs">{humanizeStatus(row.original.category)}</span>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: ({ row }) =>
        row.original.amount ? (
          <span className="tabular-nums">
            {formatCurrency(row.original.amount.amount, row.original.amount.currency)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">â€”</span>
        ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const d = row.original;
        if (d.status === 'RESOLVED' || d.status === 'CLOSED') {
          return <span className="text-xs text-muted-foreground">â€”</span>;
        }
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7"
            onClick={(e) => {
              e.stopPropagation();
              onResolve(d);
            }}
          >
            Resolve
          </Button>
        );
      },
    },
  ];
}

