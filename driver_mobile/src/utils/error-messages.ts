// src/utils/error-messages.ts

import { ApiError } from '@/services/api/errors';

export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return "We couldn't connect. Check your connection and try again.";
    }
    if (error.status >= 500) {
      return 'Something went wrong on our end. Please try again shortly.';
    }
    if (error.status === 401) {
      return 'Please log in again to continue.';
    }
    if (error.status === 403) {
      return "You don't have permission to do that.";
    }
    if (error.status === 404) {
      return 'We couldn’t find what you were looking for.';
    }
    return error.message || 'Something went wrong. Please try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}