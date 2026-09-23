'use client';

/**
 * Falcon Rider Admin Portal — Leaflet Map
 *
 * Real map using Leaflet + OpenStreetMap.
 * No API token required.
 */

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  status?: string;
  type?: 'PROVIDER' | 'TRIP' | 'JOURNEY' | 'INCIDENT';
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  height?: number;
}

const MARKER_COLORS: Record<string, string> = {
  PROVIDER: '#10b981',
  TRIP: '#3b82f6',
  JOURNEY: '#6366f1',
  INCIDENT: '#ef4444',
};

export function LeafletMap({
  markers,
  center,
  zoom = 12,
  className,
  height = 400,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet CSS
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.setAttribute('data-leaflet', 'true');
      document.head.appendChild(link);
    }

    const initMap = async () => {
      if (!mapRef.current) return;

      // Load Leaflet JS
      const L = await loadLeaflet();

      // Clean up existing map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      // Default center: Dar es Salaam
      const mapCenter = center ?? {
        lat: markers[0]?.lat ?? -6.7924,
        lng: markers[0]?.lng ?? 39.2083,
      };

      // Create map
      const map = L.map(mapRef.current).setView([mapCenter.lat, mapCenter.lng], zoom);
      leafletMapRef.current = map;

      // Add OpenStreetMap tiles (no token!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add markers
      markers.forEach((marker) => {
        const color = MARKER_COLORS[marker.type ?? 'PROVIDER'] ?? '#6b7280';

        // Custom colored marker
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const m = L.marker([marker.lat, marker.lng], { icon }).addTo(map);

        // Popup
        m.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <strong>${marker.label}</strong>
            ${marker.status ? `<br/><span style="color: #666;">${marker.status}</span>` : ''}
          </div>
        `);
      });

      // Fit bounds if multiple markers
      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [markers, center, zoom]);

  return (
    <div
      ref={mapRef}
      className={cn('w-full rounded-lg overflow-hidden border', className)}
      style={{ height }}
    />
  );
}

// ─────────────────────────────────────────
// LOAD LEAFLET
// ─────────────────────────────────────────

let leafletPromise: Promise<typeof import('leaflet')> | null = null;

function loadLeaflet(): Promise<typeof import('leaflet')> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Leaflet can only be loaded in browser'));
  }

  if ((window as unknown as { L: typeof import('leaflet') }).L) {
    return Promise.resolve((window as unknown as { L: typeof import('leaflet') }).L);
  }

  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      resolve((window as unknown as { L: typeof import('leaflet') }).L);
    };
    document.body.appendChild(script);
  });

  return leafletPromise;
}
