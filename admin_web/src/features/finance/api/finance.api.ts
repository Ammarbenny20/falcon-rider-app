/**
 * Falcon Rider Admin Portal â€” Finance API
 *
 * Payments, Refunds, Payouts, Receipts, Disputes, Reconciliation.
 * Uses MOCK data until backend contract is confirmed.
 */

import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type {
  Payment, PaymentDetail, PaymentListParams,
  Refund, RefundListParams,
  Payout, PayoutListParams,
  Receipt, ReceiptListParams,
  Dispute, DisputeListParams,
  ReconciliationRecord, ReconciliationListParams,
  FinanceOverview,
} from '../types/finance.types';

const USE_MOCK_DATA = true;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'PY-00931',
    tripId: 'TR-10482',
    customerId: 'CU-00082',
    customerName: 'John Mwangi',
    providerId: 'PR-00001',
    providerName: 'Juma Mwakalinga',
    amount: { amount: 8700, currency: 'TZS' },
    method: 'MPESA',
    status: 'SUCCESS',
    transactionRef: 'MPESA-8271HKQ',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: 'PY-00930',
    tripId: 'TR-10481',
    customerId: 'CU-00045',
    customerName: 'Amina Said',
    providerId: 'PR-00006',
    providerName: 'Grace Mushi',
    amount: { amount: 12500, currency: 'TZS' },
    method: 'CASH',
    status: 'PENDING_CASH_CONFIRMATION',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'PY-00928',
    tripId: 'TR-10478',
    customerId: 'CU-00091',
    customerName: 'David Kimaro',
    providerId: 'PR-00003',
    providerName: 'Baraka Nyerere',
    amount: { amount: 15000, currency: 'TZS' },
    method: 'MPESA',
    status: 'FAILED',
    transactionRef: 'MPESA-7728ABC',
    failureReason: 'Insufficient funds',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
  {
    id: 'PY-00918',
    tripId: 'TR-10455',
    customerId: 'CU-00012',
    customerName: 'Fatuma Ali',
    providerId: 'PR-00005',
    providerName: 'Ramadhani Kileo',
    amount: { amount: 15000, currency: 'TZS' },
    method: 'MPESA',
    status: 'REFUNDED',
    transactionRef: 'MPESA-5519XYZ',
    createdAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
  },
  {
    id: 'PY-00915',
    tripId: 'TR-10450',
    customerId: 'CU-00067',
    customerName: 'Neema Joseph',
    providerId: 'PR-00001',
    providerName: 'Juma Mwakalinga',
    amount: { amount: 22000, currency: 'TZS' },
    method: 'TIGO_PESA',
    status: 'SUCCESS',
    transactionRef: 'TIGO-2839MNP',
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
  },
];

const MOCK_REFUNDS: Refund[] = [
  {
    id: 'RF-00012',
    paymentId: 'PY-00918',
    tripId: 'TR-10455',
    customerId: 'CU-00012',
    customerName: 'Fatuma Ali',
    amount: { amount: 15000, currency: 'TZS' },
    reason: 'DUPLICATE_CHARGE',
    reasonNote: 'Customer charged twice for the same trip',
    status: 'COMPLETED',
    requestedBy: 'CU-00012',
    requestedAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    reviewedBy: 'STAFF-002',
    reviewedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
  },
  {
    id: 'RF-00013',
    paymentId: 'PY-00920',
    tripId: 'TR-10470',
    customerId: 'CU-00034',
    customerName: 'Halima Mwinyi',
    amount: { amount: 9500, currency: 'TZS' },
    reason: 'SERVICE_NOT_RENDERED',
    reasonNote: 'Provider cancelled after accepting',
    status: 'PENDING',
    requestedBy: 'CU-00034',
    requestedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
  {
    id: 'RF-00014',
    paymentId: 'PY-00922',
    tripId: 'TR-10472',
    customerId: 'CU-00078',
    customerName: 'Rashid Salim',
    amount: { amount: 18000, currency: 'TZS' },
    reason: 'CUSTOMER_COMPLAINT',
    reasonNote: 'Trip arrived late by over 45 minutes',
    status: 'PENDING',
    requestedBy: 'CU-00078',
    requestedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'PO-00231',
    providerId: 'PR-00001',
    providerName: 'Juma Mwakalinga',
    amount: { amount: 180000, currency: 'TZS' },
    method: 'MPESA',
    status: 'PENDING',
    periodStart: '2026-09-13T00:00:00Z',
    periodEnd: '2026-09-19T23:59:59Z',
    createdAt: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
  },
  {
    id: 'PO-00230',
    providerId: 'PR-00006',
    providerName: 'Grace Mushi',
    amount: { amount: 425000, currency: 'TZS' },
    method: 'MPESA',
    status: 'APPROVED',
    periodStart: '2026-09-13T00:00:00Z',
    periodEnd: '2026-09-19T23:59:59Z',
    createdAt: new Date(Date.now() - 8 * 60 * 60000).toISOString(),
  },
  {
    id: 'PO-00229',
    providerId: 'PR-00003',
    providerName: 'Baraka Nyerere',
    amount: { amount: 312000, currency: 'TZS' },
    method: 'MPESA',
    status: 'FAILED',
    periodStart: '2026-09-06T00:00:00Z',
    periodEnd: '2026-09-12T23:59:59Z',
    failureReason: 'Recipient wallet limit',
    createdAt: new Date(Date.now() - 26 * 60 * 60000).toISOString(),
  },
];

const MOCK_RECEIPTS: Receipt[] = [
  {
    id: 'RC-01023',
    tripId: 'TR-10482',
    customerId: 'CU-00082',
    customerName: 'John Mwangi',
    providerId: 'PR-00001',
    providerName: 'Juma Mwakalinga',
    vehiclePlate: 'MC 123 ABC',
    origin: 'Mbezi Beach',
    destination: 'Kariakoo',
    departedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    arrivedAt: new Date(Date.now() - 22 * 60000).toISOString(),
    distanceKm: 14.2,
    fare: { amount: 8700, currency: 'TZS' },
    method: 'MPESA',
    paymentStatus: 'SUCCESS',
    generatedAt: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: 'RC-01022',
    tripId: 'TR-10481',
    customerId: 'CU-00045',
    customerName: 'Amina Said',
    providerId: 'PR-00006',
    providerName: 'Grace Mushi',
    vehiclePlate: 'T 456 XYZ',
    origin: 'Posta',
    destination: 'Mwenge',
    departedAt: new Date(Date.now() - 65 * 60000).toISOString(),
    arrivedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    distanceKm: 9.8,
    fare: { amount: 12500, currency: 'TZS' },
    method: 'CASH',
    paymentStatus: 'PENDING_CASH_CONFIRMATION',
    generatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'DS-00045',
    paymentId: 'PY-00918',
    tripId: 'TR-10455',
    customerId: 'CU-00012',
    customerName: 'Fatuma Ali',
    providerId: 'PR-00005',
    providerName: 'Ramadhani Kileo',
    category: 'PAYMENT_AMOUNT',
    amount: { amount: 15000, currency: 'TZS' },
    description: 'Customer claims the fare charged was higher than agreed.',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
  },
  {
    id: 'DS-00044',
    paymentId: 'PY-00910',
    tripId: 'TR-10440',
    customerId: 'CU-00055',
    customerName: 'Yusuf Bakari',
    providerId: 'PR-00008',
    providerName: 'Neema Mwakyusa',
    category: 'PAYMENT_NOT_RECEIVED',
    amount: { amount: 8000, currency: 'TZS' },
    description: 'Provider says payout has not arrived after 5 days.',
    status: 'INVESTIGATING',
    assignedTo: 'STAFF-004',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

const MOCK_RECONCILIATION: ReconciliationRecord[] = [
  {
    id: 'RN-00001',
    tripId: 'TR-10482',
    fare: { amount: 8700, currency: 'TZS' },
    payment: { amount: 8700, currency: 'TZS' },
    providerEarning: { amount: 6960, currency: 'TZS' },
    platformFee: { amount: 1740, currency: 'TZS' },
    status: 'RECONCILED',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: 'RN-00002',
    tripId: 'TR-10478',
    fare: { amount: 15000, currency: 'TZS' },
    payment: { amount: 10000, currency: 'TZS' },
    providerEarning: { amount: 12000, currency: 'TZS' },
    platformFee: { amount: 3000, currency: 'TZS' },
    status: 'EXCEPTION',
    exceptionReason: 'Payment amount (10,000) does not match fare (15,000)',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
];

const MOCK_OVERVIEW: FinanceOverview = {
  totalRevenueToday: { amount: 4820000, currency: 'TZS' },
  totalRevenuePeriod: { amount: 31250000, currency: 'TZS' },
  pendingRefunds: 2,
  pendingPayouts: 1,
  openDisputes: 2,
  failedPayments: 1,
  reconciliationExceptions: 1,
  periodStart: '2026-09-01T00:00:00Z',
  periodEnd: '2026-09-30T23:59:59Z',
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HELPER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function mockPaginate<T>(items: T[], page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize;
  return {
    results: items.slice(start, start + pageSize),
    totalItems: items.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// API
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const financeApi = {
  // â”€â”€ Overview
  getOverview: async (): Promise<FinanceOverview> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return MOCK_OVERVIEW;
    }
    const { data } = await apiClient.get('/admin/finance/overview/');
    return data;
  },

  // â”€â”€ Payments
  listPayments: async (params: PaymentListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_PAYMENTS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.id.toLowerCase().includes(s) ||
            p.customerName.toLowerCase().includes(s) ||
            p.tripId?.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((p) => p.status === params.status);
      if (params.method) items = items.filter((p) => p.method === params.method);
      return mockPaginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get(ENDPOINTS.PAYMENTS.LIST, { params });
    return data;
  },

  paymentDetail: async (id: string): Promise<PaymentDetail> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const p = MOCK_PAYMENTS.find((x) => x.id === id);
      if (!p) throw new Error('Payment not found');
      return {
        ...p,
        events: [
          { id: '1', type: 'CREATED', description: 'Payment initiated', timestamp: p.createdAt },
          { id: '2', type: 'STATUS_CHANGED', description: `Status â†’ ${p.status}`, timestamp: p.updatedAt },
        ],
      };
    }
    const { data } = await apiClient.get(ENDPOINTS.PAYMENTS.DETAIL(id));
    return data;
  },

  refundPayment: async (id: string, reason: string) => {
    if (USE_MOCK_DATA) {
      await delay(700);
      return { success: true, message: 'Refund processed' };
    }
    const { data } = await apiClient.post(ENDPOINTS.PAYMENTS.REFUND(id), { reason });
    return data;
  },

  // â”€â”€ Refunds
  listRefunds: async (params: RefundListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_REFUNDS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (r) =>
            r.id.toLowerCase().includes(s) ||
            r.customerName.toLowerCase().includes(s) ||
            r.paymentId.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((r) => r.status === params.status);
      return mockPaginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/refund-requests/', { params });
    return data;
  },

  approveRefund: async (id: string, note?: string) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return { success: true };
    }
    const { data } = await apiClient.post(`/admin/refund-requests/${id}/approve/`, { note });
    return data;
  },

  rejectRefund: async (id: string, reason: string) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return { success: true };
    }
    const { data } = await apiClient.post(`/admin/refund-requests/${id}/reject/`, { reason });
    return data;
  },

  // â”€â”€ Payouts
  listPayouts: async (params: PayoutListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_PAYOUTS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.id.toLowerCase().includes(s) ||
            p.providerName.toLowerCase().includes(s)
        );
      }
      if (params.status) items = items.filter((p) => p.status === params.status);
      return mockPaginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/payouts/', { params });
    return data;
  },

  approvePayout: async (id: string) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return { success: true };
    }
    const { data } = await apiClient.post(`/admin/payouts/${id}/approve/`);
    return data;
  },

  // â”€â”€ Receipts
  listReceipts: async (params: ReceiptListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_RECEIPTS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (r) =>
            r.id.toLowerCase().includes(s) ||
            r.customerName.toLowerCase().includes(s) ||
            r.tripId.toLowerCase().includes(s)
        );
      }
      return mockPaginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/receipts/', { params });
    return data;
  },

  receiptDetail: async (id: string): Promise<Receipt> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const r = MOCK_RECEIPTS.find((x) => x.id === id);
      if (!r) throw new Error('Receipt not found');
      return r;
    }
    const { data } = await apiClient.get(`/admin/receipts/${id}/`);
    return data;
  },

  // â”€â”€ Disputes
  listDisputes: async (params: DisputeListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_DISPUTES];
      if (params.status) items = items.filter((d) => d.status === params.status);
      if (params.category) items = items.filter((d) => d.category === params.category);
      return mockPaginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/disputes/', { params });
    return data;
  },

  resolveDispute: async (id: string, resolution: string) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return { success: true };
    }
    const { data } = await apiClient.post(`/admin/disputes/${id}/resolve/`, { resolution });
    return data;
  },

  // â”€â”€ Reconciliation
  listReconciliation: async (params: ReconciliationListParams = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let items = [...MOCK_RECONCILIATION];
      if (params.status) items = items.filter((r) => r.status === params.status);
      return mockPaginate(items, params.page, params.pageSize);
    }
    const { data } = await apiClient.get('/admin/reconciliation/', { params });
    return data;
  },
};


