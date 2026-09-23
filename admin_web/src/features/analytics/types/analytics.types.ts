/**
 * Falcon Rider Admin Portal — Analytics Types
 */

export interface MarketplaceMetrics {
  periodStart: string;
  periodEnd: string;
  requests: number;
  matches: number;
  matchRate: number;
  noMatchRate: number;
  cancellationRate: number;
  completionRate: number;
  trips: number;
  bookings: number;
  gmv: { amount: number; currency: string };
  revenue: { amount: number; currency: string };
  providerEarnings: { amount: number; currency: string };
  platformFees: { amount: number; currency: string };
}

export interface MobilityMetrics {
  tripsByStatus: { status: string; count: number }[];
  requestsByStatus: { status: string; count: number }[];
  avgWaitMinutes: number;
  avgTripDurationMinutes: number;
  avgTripDistanceKm: number;
}

export interface ProviderMetrics {
  totalProviders: number;
  activeProviders: number;
  byCapability: { capability: string; count: number }[];
  byAccountStatus: { status: string; count: number }[];
  avgRating: number;
  topCities: { city: string; count: number }[];
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  repeatRate: number;
  avgTripsPerCustomer: number;
}

export interface JourneyMetrics {
  totalJourneys: number;
  publishedJourneys: number;
  completedJourneys: number;
  cancelledJourneys: number;
  skippedJourneys: number;
  totalSeats: number;
  bookedSeats: number;
  seatUtilization: number;
}

export interface FinanceMetrics {
  periodStart: string;
  periodEnd: string;
  revenueByDay: { date: string; amount: number }[];
  paymentsByMethod: { method: string; count: number; amount: number }[];
  paymentsByStatus: { status: string; count: number }[];
  refundsTotal: { amount: number; currency: string };
  payoutsTotal: { amount: number; currency: string };
}

export interface GeographyMetrics {
  byCity: { city: string; trips: number; providers: number; revenue: number }[];
  byZone: { zone: string; trips: number }[];
}

export interface AnalyticsParams {
  period?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth';
  dateFrom?: string;
  dateTo?: string;
  city?: string;
}