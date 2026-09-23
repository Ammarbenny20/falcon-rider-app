// src/features/auth/biometric/preferences.ts

import * as SecureStore from 'expo-secure-store';

const KEY = 'auth.biometric.enabled.v1';

/**
 * Whether the user has chosen to enable biometric unlock.
 * This is a preference, not a secret. Stored in SecureStore for consistency
 * with the rest of the auth stack.
 */
export async function isBiometricEnabled(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function enableBiometricPreference(): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY, 'true');
  } catch {
    // Non-fatal.
  }
}

export async function disableBiometricPreference(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    // Non-fatal.
  }
}