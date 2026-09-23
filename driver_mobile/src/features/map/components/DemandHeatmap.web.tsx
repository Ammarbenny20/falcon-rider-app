// src/features/map/components/DemandHeatmap.web.tsx

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { DEMAND_POINTS } from '../data/demand.mock';

interface DemandHeatmapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: number;
}

function HeatmapLayer() {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;
    const points: [number, number, number][] = DEMAND_POINTS.map((p) => [p.lat, p.lng, p.intensity]);
    if (heatLayerRef.current) map.removeLayer(heatLayerRef.current);
    heatLayerRef.current = (L as any).heatLayer(points, {
      radius: 35, blur: 25, maxZoom: 17, max: 1.0,
      gradient: { 0.0: '#00ff00', 0.4: '#ffff00', 0.7: '#ff8800', 1.0: '#ff0000' },
    });
    heatLayerRef.current.addTo(map);
    return () => { if (heatLayerRef.current) map.removeLayer(heatLayerRef.current); };
  }, [map]);

  return null;
}

export function DemandHeatmap({
  center = { lat: -6.792354, lng: 39.208328 },
  zoom = 12,
  height = 400,
}: DemandHeatmapProps) {
  return (
    <div style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <HeatmapLayer />
      </MapContainer>
    </div>
  );
}
