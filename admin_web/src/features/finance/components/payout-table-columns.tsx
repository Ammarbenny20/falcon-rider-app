'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatCurrency, formatDateTime, formatDate } from '@/lib/utils/format';
import type { Payout } from '../types/finance.types';

export function getPayoutColumns({
  onApprove,
}: {
  onApprove: (p: Payout) => void;
}): ColumnDef<Payout>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Payout',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'providerName',
      header: 'Provider',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.providerName}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.providerId}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(row.original.amount.amount, row.original.amount.currency)}
        </span>
      ),
    },
    {
      id: 'period',
      header: 'Period',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.periodStart)} â€“ {formatDate(row.original.periodEnd)}
        </span>
      ),
    },
    {
      accessorKey: 'method',
      header: 'Method',
      cell: ({ row }) => <span className="text-xs">{row.original.method}</span>,
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
        const p = row.original;
        if (p.status !== 'PENDING') {
          return <span className="text-xs text-muted-foreground">â€”</span>;
        }
        return (
          <Button
            size="sm"
            variant="outline"
            className="h-7"
            onClick={(e) => {
              e.stopPropagation();
              onApprove(p);
            }}
          >
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Approve
          </Button>
        );
      },
    },
  ];
}

