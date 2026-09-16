import { apiRequest } from "./client";
import type { Provider, ProviderVerification } from "../types";

export const providerApi = {
  me: (providerId: string) => apiRequest<Provider>(`/providers/${providerId}/`),

  eligibility: (providerId: string) =>
    apiRequest<{ eligible: boolean; blockers: string[] }>(`/providers/${providerId}/eligibility/`),

  goOnline: (providerId: string) =>
    apiRequest<Provider>(`/providers/${providerId}/go_online/`, { method: "POST" }),

  goOffline: (providerId: string) =>
    apiRequest<Provider>(`/providers/${providerId}/go_offline/`, { method: "POST" }),

  updateLocation: (providerId: string, lat: number, lng: number) =>
    apiRequest<{ detail: string }>(`/providers/${providerId}/update_location/`, {
      method: "POST",
      body: { lat, lng },
    }),

  submitVerification: (providerId: string, documents: Record<string, unknown>) =>
    apiRequest<ProviderVerification>(`/providers/${providerId}/verification/submit/`, {
      method: "POST",
      body: { documents },
    }),

    // append to the existing providerApi object
myPendingJourney: () =>
  apiRequest<import("../types").Paginated<import("../types").Journey>>("/journeys/", {
    params: { status: "SEARCHING" },
  }),
};

