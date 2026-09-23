import { ApiError } from '@/services/api/client';

export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) return 'Something went wrong on our end. Please try again shortly.';
    if (error.status === 401) return 'Please log in again to continue.';
    return error.message || 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please check your connection and try again.';
}
