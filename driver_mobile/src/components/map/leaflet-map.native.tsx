// src/components/map/leaflet-map.native.tsx

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

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
  height?: number;
}

const MARKER_COLORS: Record<string, string> = {
  PROVIDER: '#10b981',
  TRIP: '#3b82f6',
  JOURNEY: '#6366f1',
  INCIDENT: '#ef4444',
};

export function LeafletMap({ markers, center, zoom = 12, height = 400 }: LeafletMapProps) {
  const html = useMemo(() => {
    const mapCenter = center ?? { lat: markers[0]?.lat ?? -6.7924, lng: markers[0]?.lng ?? 39.2083 };
    const markersJson = JSON.stringify(
      markers.map((m) => ({ ...m, color: MARKER_COLORS[m.type ?? 'PROVIDER'] ?? '#6b7280' })),
    );
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .custom-marker { width: 24px; height: 24px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var markers = ${markersJson};
    var center = [${mapCenter.lat}, ${mapCenter.lng}];
    var map = L.map('map', { zoomControl: true }).setView(center, ${zoom});
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
    }).addTo(map);
    markers.forEach(function(m) {
      var icon = L.divIcon({
        className: '',
        html: '<div class="custom-marker" style="background:' + m.color + ';"></div>',
        iconSize: [24, 24], iconAnchor: [12, 12]
      });
      var marker = L.marker([m.lat, m.lng], { icon: icon }).addTo(map);
      marker.bindPopup('<strong>' + m.label + '</strong>' + (m.status ? '<br/>' + m.status : ''));
    });
    if (markers.length > 1) {
      var bounds = L.latLngBounds(markers.map(function(m) { return [m.lat, m.lng]; }));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  </script>
</body>
</html>
    `;
  }, [markers, center, zoom]);

  return (
    <View style={[styles.wrap, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', borderRadius: 12, overflow: 'hidden' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
