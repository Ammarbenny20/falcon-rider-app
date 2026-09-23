// src/features/map/components/TanzaniaMap.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const TANZANIA_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([-6.369028, 34.888822], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(map);

    var cities = [
      { name: 'Dar es Salaam', coords: [-6.792354, 39.208328] },
      { name: 'Dodoma', coords: [-6.163000, 35.751600] },
      { name: 'Arusha', coords: [-3.386925, 36.682995] },
      { name: 'Mwanza', coords: [-2.516430, 32.917500] },
      { name: 'Mbeya', coords: [-8.900000, 33.450000] }
    ];

    cities.forEach(function(city) {
      L.marker(city.coords).addTo(map).bindPopup(city.name);
    });
  </script>
</body>
</html>
`;

export function TanzaniaMap() {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: TANZANIA_HTML }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
