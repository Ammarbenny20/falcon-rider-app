'use client';

import { useMemo, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { getPaymentColumns } from '@/features/finance/components/payment-table-columns';
import { RefundActionDialog } from '@/features/finance/components/refund-action-dialog';
import { usePayments, useRefundPayment } from '@/features/finance/hooks/use-finance';
import type { Payment, PaymentListParams, PaymentStatus } from '@/features/finance/types/finance.types';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const STATUS_OPTIONS: PaymentStatus[] = [
  'PENDING', 'PENDING_CASH_CONFIRMATION', 'SUCCESS', 'PAID_CASH',
  'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'DISPUTED', 'CANCELLED',
];

export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentListParams>({ page: 1, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState('');

  const search = useDebounce(filters.search, 300);
  const params = { ...filters, search, sortBy: sorting[0]?.id, sortDirection: sorting[0]?.desc ? 'desc' as const : 'asc' as const };

  const { data, isLoading, isError, error, refetch } = usePayments(params);
  const refundMutation = useRefundPayment();

  const columns = useMemo(() => getPaymentColumns({ onRefund: setRefundTarget }), []);

  const handleRefund = async () => {
    if (!refundTarget) return;
    if (!refundReason.trim()) {
      toast.error('Reason required');
      return;
    }
    try {
      await refundMutation.mutateAsync({ id: refundTarget.id, reason: refundReason });
      toast.success('Refund processed');
      setRefundTarget(null);
      setRefundReason('');
    } catch {
      toast.error('Refund failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="All payments across the marketplace"
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
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search by ID, customer, trip…"
              value={filters.search ?? ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full sm:max-w-xs"
            />
            <Select
              value={filters.status ?? 'all'}
              onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as PaymentStatus), page: 1 })}
            >
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Dialog open={!!refundTarget} onOpenChange={(o) => !o && setRefundTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue refund</DialogTitle>
            <DialogDescription>
              {refundTarget?.id} · {refundTarget?.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="refund-reason">Reason</Label>
            <Textarea
              id="refund-reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={3}
              placeholder="Explain the refund reason…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundTarget(null)} disabled={refundMutation.isPending}>Cancel</Button>
            <Button onClick={handleRefund} disabled={refundMutation.isPending}>
              {refundMutation.isPending ? 'Processing…' : 'Refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}