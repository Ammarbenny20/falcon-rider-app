'use client';

/**
 * Operations Map — Live view of the marketplace.
 *
 * Uses real Leaflet map (OpenStreetMap) — no token needed.
 */

import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';
import { LeafletMap, type MapMarker } from '@/components/maps/leaflet-map';
import { cn } from '@/lib/utils/cn';
import type { LiveMapData, LiveMapMarker } from '../types/dashboard.types';

interface Props {
  data?: LiveMapData;
  isLoading?: boolean;
}

export function OperationsMap({ data, isLoading }: Props) {
  // Convert backend markers to Leaflet markers
  const leafletMarkers: MapMarker[] =
    data?.markers.map((m: LiveMapMarker) => ({
      id: m.id,
      lat: m.lat,
      lng: m.lng,
      label: m.label,
      status: m.status,
      type: m.type,
    })) ?? [];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-blue-600" />
          Live Operations Map
        </CardTitle>
        <div className="flex items-center gap-3 text-xs">
          <Legend color="bg-emerald-500" label="Providers" />
          <Legend color="bg-blue-500" label="Trips" />
          <Legend color="bg-indigo-500" label="Journeys" />
          <Legend color="bg-red-500" label="Incidents" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {isLoading || !data ? (
          <Skeleton className="h-[400px] w-full rounded-none" />
        ) : leafletMarkers.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">
            No live operations
          </div>
        ) : (
          <LeafletMap
            markers={leafletMarkers}
            center={data.center}
            zoom={data.zoom}
            height={400}
          />
        )}
      </CardContent>
    </Card>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      {label}
    </span>
  );
}
