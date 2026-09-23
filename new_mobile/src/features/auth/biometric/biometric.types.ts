export type BiometricAvailability =
  | 'available'
  | 'not_enrolled'
  | 'not_available'
  | 'unknown';

export type BiometricType =
  | 'face'
  | 'fingerprint'
  | 'iris'
  | 'none';

export type BiometricAuthResult =
  | { outcome: 'success' }
  | { outcome: 'cancelled' }
  | { outcome: 'failed'; reason: string }
  | { outcome: 'unavailable' };