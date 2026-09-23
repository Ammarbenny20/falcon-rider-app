'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationsApi } from '../api/operations.api';
import type {
  RequestListParams, TripListParams, BookingListParams,
  JourneyListParams, AvailabilityListParams, ExceptionListParams,
} from '../types/operations.types';

export const operationsKeys = {
  all: ['operations'] as const,
  live: () => [...operationsKeys.all, 'live'] as const,
  requests: {
    all: () => [...operationsKeys.all, 'requests'] as const,
    list: (p: RequestListParams) => [...operationsKeys.requests.all(), p] as const,
  },
  matching: {
    detail: (id: string) => [...operationsKeys.all, 'matching', id] as const,
  },
  trips: {
    all: () => [...operationsKeys.all, 'trips'] as const,
    list: (p: TripListParams) => [...operationsKeys.trips.all(), p] as const,
    detail: (id: string) => [...operationsKeys.trips.all(), 'detail', id] as const,
  },
  bookings: {
    all: () => [...operationsKeys.all, 'bookings'] as const,
    list: (p: BookingListParams) => [...operationsKeys.bookings.all(), p] as const,
  },
  scheduled: {
    all: () => [...operationsKeys.all, 'scheduled'] as const,
  },
  journeys: {
    all: () => [...operationsKeys.all, 'journeys'] as const,
    list: (p: JourneyListParams) => [...operationsKeys.journeys.all(), p] as const,
    templates: () => [...operationsKeys.journeys.all(), 'templates'] as const,
  },
  availability: {
    all: () => [...operationsKeys.all, 'availability'] as const,
    list: (p: AvailabilityListParams) => [...operationsKeys.availability.all(), p] as const,
  },
  exceptions: {
    all: () => [...operationsKeys.all, 'exceptions'] as const,
    list: (p: ExceptionListParams) => [...operationsKeys.exceptions.all(), p] as const,
  },
};

export function useLiveOperations() {
  return useQuery({
    queryKey: operationsKeys.live(),
    queryFn: () => operationsApi.getLive(),
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}

export function useRequests(params: RequestListParams = {}) {
  return useQuery({
    queryKey: operationsKeys.requests.list(params),
    queryFn: () => operationsApi.listRequests(params),
    placeholderData: (p) => p,
  });
}

export function useMatchingSession(requestId: string | undefined) {
  return useQuery({
    queryKey: operationsKeys.matching.detail(requestId ?? ''),
    queryFn: () => operationsApi.getMatchingSession(requestId!),
    enabled: !!requestId,
  });
}

export function useTrips(params: TripListParams = {}) {
  return useQuery({
    queryKey: operationsKeys.trips.list(params),
    queryFn: () => operationsApi.listTrips(params),
    placeholderData: (p) => p,
  });
}

export function useTrip(id: string | undefined) {
  return useQuery({
    queryKey: operationsKeys.trips.detail(id ?? ''),
    queryFn: () => operationsApi.tripDetail(id!),
    enabled: !!id,
  });
}

export function useBookings(params: BookingListParams = {}) {
  return useQuery({
    queryKey: operationsKeys.bookings.list(params),
    queryFn: () => operationsApi.listBookings(params),
    placeholderData: (p) => p,
  });
}

export function useScheduled() {
  return useQuery({
    queryKey: operationsKeys.scheduled.all(),
    queryFn: () => operationsApi.listScheduled(),
    refetchInterval: 30_000,
  });
}

export function useJourneys(params: JourneyListParams = {}) {
  return useQuery({
    queryKey: operationsKeys.journeys.list(params),
    queryFn: () => operationsApi.listJourneys(params),
    placeholderData: (p) => p,
  });
}

export function useJourneyTemplates() {
  return useQuery({
    queryKey: operationsKeys.journeys.templates(),
    queryFn: () => operationsApi.listJourneyTemplates(),
  });
}

export function useAvailability(params: AvailabilityListParams = {}) {
  return useQuery({
    queryKey: operationsKeys.availability.list(params),
    queryFn: () => operationsApi.listAvailability(params),
    placeholderData: (p) => p,
    refetchInterval: 30_000,
  });
}

export function useExceptions(params: ExceptionListParams = {}) {
  return useQuery({
    queryKey: operationsKeys.exceptions.list(params),
    queryFn: () => operationsApi.listExceptions(params),
    placeholderData: (p) => p,
  });
}

export function useResolveException() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      operationsApi.resolveException(id, resolution),
    onSuccess: () => qc.invalidateQueries({ queryKey: operationsKeys.exceptions.all() }),
  });
}