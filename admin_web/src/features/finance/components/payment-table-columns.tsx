'use client';

import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import type { Payment } from '../types/finance.types';

export function getPaymentColumns({
  onRefund,
}: {
  onRefund: (p: Payment) => void;
}): ColumnDef<Payment>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Payment',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-medium">{row.original.id}</span>
          {row.original.tripId && (
            <span className="text-xs text-muted-foreground">
              Trip {row.original.tripId}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.customerName}</span>
          <span className="text-xs text-muted-foreground">{row.original.customerId}</span>
        </div>
      ),
    },
    {
      accessorKey: 'providerName',
      header: 'Provider',
      cell: ({ row }) =>
        row.original.providerName ? (
          <div className="flex flex-col">
            <span className="text-sm">{row.original.providerName}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.providerId}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">â€”</span>
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
      accessorKey: 'method',
      header: 'Method',
      cell: ({ row }) => (
        <span className="text-xs">{row.original.method}</span>
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
        const p = row.original;
        const canRefund = p.status === 'SUCCESS';
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/money/payments/${p.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              {canRefund && (
                <DropdownMenuItem onClick={() => onRefund(p)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Issue refund
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

