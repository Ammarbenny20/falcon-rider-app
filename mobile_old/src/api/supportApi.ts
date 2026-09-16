import { apiRequest } from "./client";
import type { SupportTicket, Paginated } from "../types";

export const supportApi = {
  list: () => apiRequest<Paginated<SupportTicket>>("/support/tickets/"),

  get: (id: string) => apiRequest<SupportTicket>(`/support/tickets/${id}/`),

  create: (subject: string, description: string, journey?: string) =>
    apiRequest<SupportTicket>("/support/tickets/", { method: "POST", body: { subject, description, journey } }),

  reply: (id: string, body: string) =>
    apiRequest(`/support/tickets/${id}/reply/`, { method: "POST", body: { body } }),
};