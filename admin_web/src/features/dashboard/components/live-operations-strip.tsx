'use client';

/**
 * Live Operations Strip — what is happening now.
 */

import {
  Activity, Users, Bike, Search, CheckCircle2, MapPin, Calendar, Armchair,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';
import { formatNumber } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { LiveOperationsStats } from '../types/dashboard.types';

interface Props {
  data?: LiveOperationsStats;
  isLoading?: boolean;
}

export function LiveOperationsStrip({ data, isLoading }: Props) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="mt-3 h-6 w-12" />
              <Skeleton className="mt-1 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    { icon: Activity, label: 'Active Trips', value: data.activeTrips, accent: 'text-blue-600' },
    { icon: Users, label: 'Providers Online', value: data.providersOnline, accent: 'text-emerald-600' },
    { icon: Bike, label: 'Available', value: data.providersAvailable, accent: 'text-emerald-700' },
    { icon: Search, label: 'Searching', value: data.requestsSearching, accent: 'text-amber-600' },
    { icon: CheckCircle2, label: 'Matched', value: data.requestsMatched, accent: 'text-emerald-600' },
    { icon: MapPin, label: 'Active Journeys', value: data.activeJourneys, accent: 'text-indigo-600' },
    { icon: Armchair, label: 'Seats Open', value: data.availableSeats, accent: 'text-indigo-700' },
    { icon: Calendar, label: 'Upcoming', value: data.scheduledApproaching, accent: 'text-amber-700' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
      {items.map((item) => (
        <Card key={item.label} className="transition-colors hover:bg-muted/40">
          <CardContent className="pt-4">
            <item.icon className={cn('h-5 w-5', item.accent)} />
            <div className="mt-2 text-2xl font-semibold tabular-nums">
              {formatNumber(item.value)}
            </div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}