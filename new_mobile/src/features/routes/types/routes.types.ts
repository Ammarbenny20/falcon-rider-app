// src/features/routes/types/routes.types.ts

export type PlaceSearchResult = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type GeocodeResponse = {
  results: PlaceSearchResult[];
};

export type DirectionsRequest = {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
};

export type DirectionsResponse = {
  distance_meters: number;
  duration_seconds: number;
  polyline: string;
};