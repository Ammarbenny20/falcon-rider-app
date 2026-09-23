'use client';

/**
 * Trip 360 Tabs
 */

import { MapPin, Users, Wallet, Activity, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timeline, type TimelineEvent } from '@/features/shared/components/timeline';
import { InfoRow, InfoGrid } from '@/features/shared/components/info-row';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { formatCurrency, formatDateTime, formatDurationBetween } from '@/lib/utils/format';
import type { Trip } from '../types/operations.types';

export function Trip360Tabs({ trip }: { trip: Trip }) {
  // Build timeline from trip fields
  const events: TimelineEvent[] = [];

  if (trip.createdAt) {
    events.push({
      id: 'created',
      title: 'Trip created',
      timestamp: trip.createdAt,
      severity: 'info',
    });
  }
  if (trip.startedAt) {
    events.push({
      id: 'started',
      title: 'Trip started',
      timestamp: trip.startedAt,
      severity: 'success',
    });
  }
  if (trip.completedAt) {
    events.push({
      id: 'completed',
      title: 'Trip completed',
      timestamp: trip.completedAt,
      severity: 'success',
      description: trip.distanceKm ? `${trip.distanceKm} km` : undefined,
    });
  }
  if (trip.cancelledAt) {
    events.push({
      id: 'cancelled',
      title: 'Trip cancelled',
      timestamp: trip.cancelledAt,
      severity: 'danger',
    });
  }

  const duration =
    trip.startedAt && trip.completedAt
      ? formatDurationBetween(trip.startedAt, trip.completedAt)
      : null;

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="route">Route</TabsTrigger>
        <TabsTrigger value="parties">Parties</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Status" value={<StatusBadgeAuto status={trip.status} />} />
              <InfoRow label="Booking Type" value={trip.bookingType} />
              <InfoRow label="Ride Access" value={trip.rideAccessType} />
              <InfoRow
                label="Fare"
                value={formatCurrency(trip.fare.amount, trip.fare.currency)}
              />
              {trip.distanceKm !== undefined && (
                <InfoRow label="Distance" value={`${trip.distanceKm} km`} />
              )}
              {duration && <InfoRow label="Duration" value={duration} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Created" value={formatDateTime(trip.createdAt)} />
              {trip.scheduledStart && (
                <InfoRow label="Scheduled Start" value={formatDateTime(trip.scheduledStart)} />
              )}
              {trip.startedAt && (
                <InfoRow label="Started" value={formatDateTime(trip.startedAt)} />
              )}
              {trip.completedAt && (
                <InfoRow label="Completed" value={formatDateTime(trip.completedAt)} />
              )}
              <InfoRow label="Updated" value={formatDateTime(trip.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="timeline">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trip Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={events} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="route">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-primary" />
              Route
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Origin</div>
                  <div className="font-medium">{trip.originAddress}</div>
                  <div className="text-xs text-muted-foreground">
                    {trip.originCoords.lat.toFixed(4)}, {trip.originCoords.lng.toFixed(4)}
                  </div>
                </div>
              </div>
              <div className="ml-1 h-8 border-l-2 border-dashed" />
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Destination</div>
                  <div className="font-medium">{trip.destinationAddress}</div>
                  <div className="text-xs text-muted-foreground">
                    {trip.destinationCoords.lat.toFixed(4)}, {trip.destinationCoords.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              Map visualization will appear here (Mapbox integration pending)
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="parties">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Name" value={trip.customerName} />
              <InfoRow label="Customer ID" value={<span className="font-mono text-xs">{trip.customerId}</span>} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trip.providerName ? (
                <>
                  <InfoRow label="Name" value={trip.providerName} />
                  <InfoRow label="Provider ID" value={<span className="font-mono text-xs">{trip.providerId}</span>} />
                  {trip.vehiclePlate && (
                    <InfoRow label="Vehicle" value={<span className="font-mono text-xs">{trip.vehiclePlate}</span>} />
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No provider assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-4 w-4" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow
              label="Fare"
              value={formatCurrency(trip.fare.amount, trip.fare.currency)}
            />
            <InfoRow label="Currency" value={trip.fare.currency} />
            <p className="mt-4 text-xs text-muted-foreground">
              Detailed payment info will be linked when payment record is available.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}