// src/features/map/components/DemandHeatmap.native.tsx

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { DEMAND_POINTS } from '../data/demand.mock';

interface DemandHeatmapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: number;
}

export function DemandHeatmap({
  center = { lat: -6.792354, lng: 39.208328 },
  zoom = 12,
  height = 400,
}: DemandHeatmapProps) {
  const html = useMemo(() => {
    const pointsJson = JSON.stringify(
      DEMAND_POINTS.map((p) => [p.lat, p.lng, p.intensity]),
    );

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var points = ${pointsJson};
    var map = L.map('map').setView([${center.lat}, ${center.lng}], ${zoom});
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    }).addTo(map);
    L.heatLayer(points, {
      radius: 35, blur: 25, maxZoom: 17, max: 1.0,
      gradient: { 0.0: '#00ff00', 0.4: '#ffff00', 0.7: '#ff8800', 1.0: '#ff0000' }
    }).addTo(map);
  </script>
</body>
</html>
    `;
  }, [center, zoom]);

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
