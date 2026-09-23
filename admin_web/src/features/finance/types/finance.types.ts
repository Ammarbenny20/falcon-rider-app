/**
 * Falcon Rider Admin Portal — Finance Types
 *
 * Types for Payments, Refunds, Payouts, Receipts, Disputes, Reconciliation.
 */

import type { Money } from '@/types/common.types';

// ─────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────

export type PaymentStatus =
  | 'PENDING'
  | 'PENDING_CASH_CONFIRMATION'
  | 'SUCCESS'
  | 'PAID_CASH'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'DISPUTED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'CASH'
  | 'MPESA'
  | 'TIGO_PESA'
  | 'AIRTEL_MONEY'
  | 'CARD'
  | 'WALLET'
  | 'DEMO';

export interface Payment {
  id: string;
  tripId?: string;
  customerId: string;
  customerName: string;
  providerId?: string;
  providerName?: string;

  amount: Money;
  method: PaymentMethod;
  status: PaymentStatus;

  transactionRef?: string;
  providerResponse?: string;
  failureReason?: string;

  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetail extends Payment {
  trip?: {
    id: string;
    origin: string;
    destination: string;
    startedAt?: string;
    completedAt?: string;
  };
  events: PaymentEvent[];
}

export interface PaymentEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  actor?: string;
}

export interface PaymentListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─────────────────────────────────────────
// REFUNDS
// ─────────────────────────────────────────

export type RefundStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type RefundReason =
  | 'DUPLICATE_CHARGE'
  | 'SERVICE_NOT_RENDERED'
  | 'CUSTOMER_COMPLAINT'
  | 'PROVIDER_CANCELLED'
  | 'SYSTEM_ERROR'
  | 'OTHER';

export interface Refund {
  id: string;
  paymentId: string;
  tripId?: string;
  customerId: string;
  customerName: string;
  amount: Money;
  reason: RefundReason;
  reasonNote?: string;
  status: RefundStatus;
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  completedAt?: string;
}

export interface RefundListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: RefundStatus;
  reason?: RefundReason;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─────────────────────────────────────────
// PAYOUTS
// ─────────────────────────────────────────

export type PayoutStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REJECTED';

export interface Payout {
  id: string;
  providerId: string;
  providerName: string;
  amount: Money;
  method: PaymentMethod;
  status: PayoutStatus;
  periodStart: string;
  periodEnd: string;
  transactionRef?: string;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface PayoutListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: PayoutStatus;
  providerId?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─────────────────────────────────────────
// RECEIPTS
// ─────────────────────────────────────────

export interface Receipt {
  id: string;
  tripId: string;
  customerId: string;
  customerName: string;
  providerId?: string;
  providerName?: string;
  vehiclePlate?: string;

  origin: string;
  destination: string;
  departedAt?: string;
  arrivedAt?: string;
  distanceKm?: number;

  fare: Money;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;

  generatedAt: string;
}

export interface ReceiptListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─────────────────────────────────────────
// DISPUTES
// ─────────────────────────────────────────

export type DisputeStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'CLOSED';

export type DisputeCategory =
  | 'PAYMENT_AMOUNT'
  | 'PAYMENT_NOT_RECEIVED'
  | 'SERVICE_QUALITY'
  | 'UNAUTHORIZED_CHARGE'
  | 'OTHER';

export interface Dispute {
  id: string;
  paymentId?: string;
  tripId?: string;
  customerId: string;
  customerName: string;
  providerId?: string;
  providerName?: string;
  category: DisputeCategory;
  amount?: Money;
  description: string;
  status: DisputeStatus;
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface DisputeListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: DisputeStatus;
  category?: DisputeCategory;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─────────────────────────────────────────
// RECONCILIATION
// ─────────────────────────────────────────

export type ReconciliationStatus = 'RECONCILED' | 'EXCEPTION' | 'PENDING';

export interface ReconciliationRecord {
  id: string;
  tripId: string;
  fare: Money;
  payment: Money;
  providerEarning: Money;
  platformFee: Money;
  status: ReconciliationStatus;
  exceptionReason?: string;
  createdAt: string;
}

export interface ReconciliationListParams {
  page?: number;
  pageSize?: number;
  status?: ReconciliationStatus;
  dateFrom?: string;
  dateTo?: string;
}

// ─────────────────────────────────────────
// AGGREGATES
// ─────────────────────────────────────────

export interface FinanceOverview {
  totalRevenueToday: Money;
  totalRevenuePeriod: Money;
  pendingRefunds: number;
  pendingPayouts: number;
  openDisputes: number;
  failedPayments: number;
  reconciliationExceptions: number;
  periodStart: string;
  periodEnd: string;
}