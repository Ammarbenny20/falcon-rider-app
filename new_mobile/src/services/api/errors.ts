// src/services/api/errors.ts

/**
 * Structured API error.
 *
 * Thrown by the API client for any non-2xx response, network failure, or
 * timeout. Consumers should catch this and use `toUserMessage()` from
 * `utils/error-messages.ts` for display.
 *
 * `status === 0` means a network-level failure (no HTTP response received).
 * `fieldErrors` is populated for 400/422 validation errors when the backend
 * returns DRF-style field errors.
 */
export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}