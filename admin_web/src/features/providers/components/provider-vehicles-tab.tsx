'use client';

/**
 * Falcon Rider Admin Portal — Provider Vehicles Tab
 */

import { Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import type { ProviderVehicle } from '../types/provider.types';

export function ProviderVehiclesTab({ vehicles }: { vehicles: ProviderVehicle[] }) {
  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={Car}
        title="No vehicles"
        description="This provider has not registered any vehicles yet."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {vehicles.map((v) => (
        <Card key={v.id}>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">
                  {v.make} {v.model}
                </div>
                <div className="text-sm text-muted-foreground">
                  {v.plateNumber} · {v.color}
                </div>
              </div>
              <StatusBadgeAuto status={v.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Type</div>
                <div className="font-medium">{v.vehicleType}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Capacity</div>
                <div className="font-medium">{v.capacity}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Year</div>
                <div className="font-medium">{v.year ?? '—'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}