'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatCurrency, formatDateTime, humanizeStatus } from '@/lib/utils/format';
import type { Refund } from '../types/finance.types';

export function getRefundColumns({
  onApprove,
  onReject,
}: {
  onApprove: (r: Refund) => void;
  onReject: (r: Refund) => void;
}): ColumnDef<Refund>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Refund',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-medium">{row.original.id}</span>
          <span className="text-xs text-muted-foreground">
            Payment {row.original.paymentId}
          </span>
        </div>
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
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(row.original.amount.amount, row.original.amount.currency)}
        </span>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <span className="text-xs">{humanizeStatus(row.original.reason)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
    },
    {
      accessorKey: 'requestedAt',
      header: 'Requested',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDateTime(row.original.requestedAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const r = row.original;
        if (r.status !== 'PENDING') {
          return <span className="text-xs text-muted-foreground">â€”</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7"
              onClick={(e) => {
                e.stopPropagation();
                onApprove(r);
              }}
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onReject(r);
              }}
            >
              <XCircle className="mr-1 h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];
}

