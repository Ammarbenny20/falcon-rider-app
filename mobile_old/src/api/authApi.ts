import { apiRequest } from "./client";
import type { User } from "../types";

export const authApi = {
  requestOtp: (phone_number: string) =>
    apiRequest<{ detail: string }>("/auth/otp/request/", {
      method: "POST",
      body: { phone_number },
    }),

  verifyOtp: (phone_number: string, code: string, role?: string, full_name?: string) =>
    apiRequest<{ token: string; user: User; created: boolean }>("/auth/otp/verify/", {
      method: "POST",
      body: { phone_number, code, role, full_name },
    }),

  logout: () => apiRequest<{ detail: string }>("/auth/logout/", { method: "POST" }),

  me: () => apiRequest<User>("/auth/me/"),
};