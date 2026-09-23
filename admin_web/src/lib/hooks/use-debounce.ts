/**
 * Falcon Rider Admin Portal — useDebounce
 *
 * Debounces a value. Useful for search inputs, filters.
 * Delays updates until the user stops changing the value.
 */

'use client';

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}