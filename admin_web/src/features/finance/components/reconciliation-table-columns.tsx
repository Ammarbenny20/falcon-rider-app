'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatCurrency } from '@/lib/utils/format';
import type { ReconciliationRecord } from '../types/finance.types';

export const reconciliationColumns: ColumnDef<ReconciliationRecord>[] = [
  {
    accessorKey: 'id',
    header: 'Record',
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
    id: 'fare',
    header: 'Fare',
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.fare.amount, row.original.fare.currency)}
      </span>
    ),
  },
  {
    id: 'payment',
    header: 'Payment',
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.payment.amount, row.original.payment.currency)}
      </span>
    ),
  },
  {
    id: 'earning',
    header: 'Provider Earning',
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(
          row.original.providerEarning.amount,
          row.original.providerEarning.currency
        )}
      </span>
    ),
  },
  {
    id: 'fee',
    header: 'Platform Fee',
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.platformFee.amount, row.original.platformFee.currency)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadgeAuto status={row.original.status} />,
  },
  {
    id: 'reason',
    header: 'Exception',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.exceptionReason ?? 'â€”'}
      </span>
    ),
  },
];

