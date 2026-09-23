// src/components/map/leaflet-map.web.tsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function LeafletMap({ markers, center, zoom = 12, height = 400 }: LeafletMapProps) {
  const mapCenter = center ?? { lat: markers[0]?.lat ?? -6.7924, lng: markers[0]?.lng ?? 39.2083 };

  return (
    <div style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createMarkerIcon(MARKER_COLORS[marker.type ?? 'PROVIDER'] ?? '#6b7280')}
          >
            <Popup>
              <strong>{marker.label}</strong>
              {marker.status ? <><br />{marker.status}</> : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
