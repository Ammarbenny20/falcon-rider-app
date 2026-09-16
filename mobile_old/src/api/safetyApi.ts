import { apiRequest } from "./client";
import type { SafetyIncident, TrustedContact, Paginated } from "../types";

export const safetyApi = {
  reportIncident: (payload: { journey: string; category: string; description: string }) =>
    apiRequest<SafetyIncident>("/safety/incidents/", { method: "POST", body: payload }),

  myIncidents: () => apiRequest<Paginated<SafetyIncident>>("/safety/incidents/"),

  trustedContacts: () => apiRequest<Paginated<TrustedContact>>("/safety/trusted-contacts/"),

  addTrustedContact: (name: string, phone_number: string) =>
    apiRequest<TrustedContact>("/safety/trusted-contacts/", { method: "POST", body: { name, phone_number } }),
};