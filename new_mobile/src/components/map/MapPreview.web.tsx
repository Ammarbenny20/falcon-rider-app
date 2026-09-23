// src/components/map/MapPreview.web.tsx
//
// Web version of MapPreview using Leaflet + OpenStreetMap.
// No API token required.

import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

type MapPreviewProps = {
  latitude: number;
  longitude: number;
  label?: string;
};

export function MapPreview({ latitude, longitude, label }: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS dynamically
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.setAttribute('data-leaflet', 'true');
      document.head.appendChild(link);
    }

    // Load Leaflet JS dynamically
    const loadLeaflet = () => {
      if ((window as any).L) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const L = (window as any).L;

      // Clean up previous map
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }

      // Create map
      const map = L.map(mapRef.current).setView([latitude, longitude], 14);
      leafletMap.current = map;

      // Add OpenStreetMap tiles (no token!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = L.marker([latitude, longitude]).addTo(map);
      if (label) {
        marker.bindPopup(label).openPopup();
      }
    };

    loadLeaflet();

    // Cleanup on unmount
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [latitude, longitude, label]);

  return (
    <View style={styles.wrap}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 300,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
