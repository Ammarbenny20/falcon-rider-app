// src/services/storage/secure-storage.web.ts
//
// Web version of secure storage. Uses localStorage since SecureStore
// is not available on web. This file is only loaded when the app runs
// on web (Expo resolves `.web.ts` files automatically for web builds).
//
// NOTE: localStorage is NOT secure. This is acceptable for web
// development/demo purposes. Do not store production secrets here.

const PREFIX = 'falconriderdriver.secure.';

export const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      return window.localStorage.getItem(PREFIX + key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      window.localStorage.setItem(PREFIX + key, value);
    } catch {
      // Non-fatal.
    }
  },

  async remove(key: string): Promise<void> {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      // Non-fatal.
    }
  },
};