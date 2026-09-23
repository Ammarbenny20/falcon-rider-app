// src/services/storage/local-storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const localStorage = {
  get: async <T>(key: string): Promise<T | null> => {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  remove: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};