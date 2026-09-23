// src/features/auth/biometric/biometric.service.ts

import * as LocalAuthentication from 'expo-local-authentication';

import type {
  BiometricAuthResult,
  BiometricAvailability,
  BiometricType,
} from '@/features/auth/biometric/biometric.types';

/**
 * Biometric service.
 *
 * Thin wrapper around expo-local-authentication. This is the ONLY file in
 * the app that imports the library directly.
 *
 * Biometric is a device-level convenience/security layer. It NEVER replaces
 * backend authentication and NEVER transmits biometric data anywhere.
 */
export const biometricService = {
  async checkAvailability(): Promise<BiometricAvailability> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) return 'not_available';

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) return 'not_enrolled';

      return 'available';
    } catch {
      return 'unknown';
    }
  },

  async getSupportedTypes(): Promise<BiometricType[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const result: BiometricType[] = [];
      if (
        types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        )
      ) {
        result.push('face');
      }
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        result.push('fingerprint');
      }
      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        result.push('iris');
      }
      return result;
    } catch {
      return [];
    }
  },

  async authenticate(reason: string): Promise<BiometricAuthResult> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { outcome: 'success' };
      }

      if (result.error === 'user_cancel' || result.error === 'system_cancel') {
        return { outcome: 'cancelled' };
      }

      return {
        outcome: 'failed',
        reason: result.error ?? 'unknown',
      };
    } catch {
      return { outcome: 'unavailable' };
    }
  },
};