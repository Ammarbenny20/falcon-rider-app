import { apiRequest } from "./client";
import type { Journey, TransportType, Paginated } from "../types";

export const journeyApi = {
  list: (params?: { status?: string; transport_type?: string }) =>
    apiRequest<Paginated<Journey>>("/journeys/", { params }),

  get: (id: string) => apiRequest<Journey>(`/journeys/${id}/`),

  create: (payload: {
    transport_type: TransportType;
    origin_lat: number;
    origin_lng: number;
    origin_label: string;
    destination_lat: number;
    destination_lng: number;
    destination_label: string;
    is_scheduled?: boolean;
    scheduled_for?: string;
  }) => apiRequest<Journey>("/journeys/", { method: "POST", body: payload }),

  accept: (id: string) => apiRequest<Journey>(`/journeys/${id}/accept/`, { method: "POST" }),
  arrive: (id: string) => apiRequest<Journey>(`/journeys/${id}/arrive/`, { method: "POST" }),
  start: (id: string) => apiRequest<Journey>(`/journeys/${id}/start/`, { method: "POST" }),
  complete: (id: string) => apiRequest<Journey>(`/journeys/${id}/complete/`, { method: "POST" }),
};

// append to the existing journeyApi object
quote: (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) =>
  apiRequest<import("../types").TransportOption[]>("/journeys/quote/", {
    method: "POST",
    body: { origin, destination },
  }),