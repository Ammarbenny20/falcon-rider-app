import { apiRequest } from "./client";
import type { Paginated, User, Provider, Journey } from "../types";

interface AdminOverview {
  total_users: number;
  active_commuters: number;
  registered_providers: number;
  verified_providers: number;
  providers_online: number;
  active_journeys: number;
  completed_journeys: number;
  todays_journeys: number;
  todays_revenue: number;
  alerts: {
    providers_awaiting_verification: number;
    vehicles_awaiting_verification: number;
    safety_incidents: number;
    failed_payments: number;
    cancelled_journeys: number;
    open_support_tickets: number;
    bus_bookings_needing_action: number;
  };
}

export const adminApi = {
  overview: () => apiRequest<AdminOverview>("/admin/overview/"),

  users: (params?: { role?: string; status?: string }) =>
    apiRequest<Paginated<User>>("/admin/users/", { params }),

  suspendUser: (id: string) => apiRequest<User>(`/admin/users/${id}/suspend/`, { method: "POST" }),
  reactivateUser: (id: string) => apiRequest<User>(`/admin/users/${id}/reactivate/`, { method: "POST" }),

  providers: (params?: { verification_status?: string }) =>
    apiRequest<Paginated<Provider>>("/providers/", { params }),

  approveProvider: (id: string) =>
    apiRequest(`/providers/${id}/verification/approve/`, { method: "POST" }),
  rejectProvider: (id: string, notes: string) =>
    apiRequest(`/providers/${id}/verification/reject/`, { method: "POST", body: { notes } }),
  requestCorrection: (id: string, notes: string) =>
    apiRequest(`/providers/${id}/verification/request-correction/`, { method: "POST", body: { notes } }),

  journeys: (params?: { status?: string }) =>
    apiRequest<Paginated<Journey>>("/journeys/", { params }),
};