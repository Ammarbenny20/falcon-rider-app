// src/hooks/use-current-location.ts

import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export type PlaceSelection = {
  label: string;
  latitude: number;
  longitude: number;
};

type Status = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

type State = {
  status: Status;
  place: PlaceSelection | null;
};

export function useCurrentLocation() {
  const [state, setState] = useState<State>({
    status: 'idle',
    place: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading' }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ status: 'denied', place: null });
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let label = 'Current location';
      try {
        const [place] = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (place) {
          label =
            [place.name, place.street, place.city]
              .filter(Boolean)
              .join(', ') || label;
        }
      } catch {
        // ignore reverse geocode failure
      }

      setState({
        status: 'granted',
        place: {
          label,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    } catch {
      setState({ status: 'error', place: null });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}