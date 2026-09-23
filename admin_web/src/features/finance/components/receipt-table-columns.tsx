'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import type { Receipt } from '../types/finance.types';

export const receiptColumns: ColumnDef<Receipt>[] = [
  {
    accessorKey: 'id',
    header: 'Receipt',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-mono text-sm font-medium">{row.original.id}</span>
        <span className="text-xs text-muted-foreground">
          Trip {row.original.tripId}
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
    id: 'route',
    header: 'Route',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.origin} â†’ {row.original.destination}
      </span>
    ),
  },
  {
    accessorKey: 'fare',
    header: 'Fare',
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.fare.amount, row.original.fare.currency)}
      </span>
    ),
  },
  {
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => <span className="text-xs">{row.original.method}</span>,
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Status',
    cell: ({ row }) => <StatusBadgeAuto status={row.original.paymentStatus} />,
  },
  {
    accessorKey: 'generatedAt',
    header: 'Generated',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDateTime(row.original.generatedAt)}
      </span>
    ),
  },
];

