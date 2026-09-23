// src/services/api/types.ts

export type RequestOptions = {
  /**
   * If true, the client will NOT attach an Authorization header.
   * Used for public endpoints (login, register, health checks).
   */
  skipAuth?: boolean;
};