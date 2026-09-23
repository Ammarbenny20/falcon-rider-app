'use client';

/**
 * Falcon Rider Admin Portal — Finance Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../api/finance.api';
import type {
  PaymentListParams,
  RefundListParams,
  PayoutListParams,
  ReceiptListParams,
  DisputeListParams,
  ReconciliationListParams,
} from '../types/finance.types';

export const financeKeys = {
  all: ['finance'] as const,
  overview: () => [...financeKeys.all, 'overview'] as const,
  payments: {
    all: () => [...financeKeys.all, 'payments'] as const,
    list: (p: PaymentListParams) => [...financeKeys.payments.all(), p] as const,
    detail: (id: string) => [...financeKeys.payments.all(), 'detail', id] as const,
  },
  refunds: {
    all: () => [...financeKeys.all, 'refunds'] as const,
    list: (p: RefundListParams) => [...financeKeys.refunds.all(), p] as const,
  },
  payouts: {
    all: () => [...financeKeys.all, 'payouts'] as const,
    list: (p: PayoutListParams) => [...financeKeys.payouts.all(), p] as const,
  },
  receipts: {
    all: () => [...financeKeys.all, 'receipts'] as const,
    list: (p: ReceiptListParams) => [...financeKeys.receipts.all(), p] as const,
    detail: (id: string) => [...financeKeys.receipts.all(), 'detail', id] as const,
  },
  disputes: {
    all: () => [...financeKeys.all, 'disputes'] as const,
    list: (p: DisputeListParams) => [...financeKeys.disputes.all(), p] as const,
  },
  reconciliation: {
    all: () => [...financeKeys.all, 'reconciliation'] as const,
    list: (p: ReconciliationListParams) => [...financeKeys.reconciliation.all(), p] as const,
  },
};

// ── Overview
export function useFinanceOverview() {
  return useQuery({
    queryKey: financeKeys.overview(),
    queryFn: () => financeApi.getOverview(),
    staleTime: 60_000,
  });
}

// ── Payments
export function usePayments(params: PaymentListParams = {}) {
  return useQuery({
    queryKey: financeKeys.payments.list(params),
    queryFn: () => financeApi.listPayments(params),
    placeholderData: (prev) => prev,
  });
}

export function usePayment(id: string | undefined) {
  return useQuery({
    queryKey: financeKeys.payments.detail(id ?? ''),
    queryFn: () => financeApi.paymentDetail(id!),
    enabled: !!id,
  });
}

export function useRefundPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      financeApi.refundPayment(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financeKeys.payments.all() });
      qc.invalidateQueries({ queryKey: financeKeys.overview() });
    },
  });
}

// ── Refunds
export function useRefunds(params: RefundListParams = {}) {
  return useQuery({
    queryKey: financeKeys.refunds.list(params),
    queryFn: () => financeApi.listRefunds(params),
    placeholderData: (prev) => prev,
  });
}

export function useApproveRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      financeApi.approveRefund(id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financeKeys.refunds.all() });
      qc.invalidateQueries({ queryKey: financeKeys.overview() });
    },
  });
}

export function useRejectRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      financeApi.rejectRefund(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financeKeys.refunds.all() });
      qc.invalidateQueries({ queryKey: financeKeys.overview() });
    },
  });
}

// ── Payouts
export function usePayouts(params: PayoutListParams = {}) {
  return useQuery({
    queryKey: financeKeys.payouts.list(params),
    queryFn: () => financeApi.listPayouts(params),
    placeholderData: (prev) => prev,
  });
}

export function useApprovePayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeApi.approvePayout(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financeKeys.payouts.all() });
      qc.invalidateQueries({ queryKey: financeKeys.overview() });
    },
  });
}

// ── Receipts
export function useReceipts(params: ReceiptListParams = {}) {
  return useQuery({
    queryKey: financeKeys.receipts.list(params),
    queryFn: () => financeApi.listReceipts(params),
    placeholderData: (prev) => prev,
  });
}

export function useReceipt(id: string | undefined) {
  return useQuery({
    queryKey: financeKeys.receipts.detail(id ?? ''),
    queryFn: () => financeApi.receiptDetail(id!),
    enabled: !!id,
  });
}

// ── Disputes
export function useDisputes(params: DisputeListParams = {}) {
  return useQuery({
    queryKey: financeKeys.disputes.list(params),
    queryFn: () => financeApi.listDisputes(params),
    placeholderData: (prev) => prev,
  });
}

export function useResolveDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      financeApi.resolveDispute(id, resolution),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financeKeys.disputes.all() });
      qc.invalidateQueries({ queryKey: financeKeys.overview() });
    },
  });
}

// ── Reconciliation
export function useReconciliation(params: ReconciliationListParams = {}) {
  return useQuery({
    queryKey: financeKeys.reconciliation.list(params),
    queryFn: () => financeApi.listReconciliation(params),
    placeholderData: (prev) => prev,
  });
}