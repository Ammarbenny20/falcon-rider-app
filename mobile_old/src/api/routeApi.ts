import { apiRequest } from "./client";
import type { GeoPoint } from "../types";

interface GeocodeResult {
  lat: number;
  lng: number;
  label: string;
}

interface RouteResult {
  distance_meters: number;
  duration_min_seconds: number;
  duration_max_seconds: number;
  polyline: string;
}

export const routeApi = {
  geocode: (query: string) =>
    apiRequest<{ results: GeocodeResult[] }>("/routes/geocode/", { params: { q: query } }),

  calculate: (origin: GeoPoint, destination: GeoPoint) =>
    apiRequest<RouteResult>("/routes/calculate/", {
      method: "POST",
      body: { origin, destination },
    }),
};