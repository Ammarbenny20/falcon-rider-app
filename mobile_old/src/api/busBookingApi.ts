import { apiRequest } from "./client";
import type { BusBooking, Paginated } from "../types";

export const busBookingApi = {
  list: () => apiRequest<Paginated<BusBooking>>("/bus-bookings/"),

  get: (id: string) => apiRequest<BusBooking>(`/bus-bookings/${id}/`),

  create: (payload: {
    contact_phone: string;
    organization_name?: string;
    pickup_label: string;
    pickup_lat: number;
    pickup_lng: number;
    destination_label: string;
    destination_lat: number;
    destination_lng: number;
    travel_date: string;
    departure_window_start: string;
    departure_window_end: string;
    passenger_count: number;
    is_return_journey?: boolean;
    vehicle_type_requested?: string;
  }) => apiRequest<BusBooking>("/bus-bookings/", { method: "POST", body: payload }),
};