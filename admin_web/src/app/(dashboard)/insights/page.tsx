'use client';

import Link from 'next/link';
import {
  BarChart3, Users, Car, MapPin, DollarSign, TrendingUp, Globe, FileText,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';

const SECTIONS = [
  { href: '/insights/marketplace', label: 'Marketplace', icon: BarChart3, description: 'Requests, matches, GMV, revenue' },
  { href: '/insights/mobility', label: 'Mobility', icon: TrendingUp, description: 'Trips, wait times, distances' },
  { href: '/insights/customers', label: 'Customers', icon: Users, description: 'Customer growth, retention' },
  { href: '/insights/providers', label: 'Providers', icon: Car, description: 'Provider supply, capabilities' },
  { href: '/insights/journeys', label: 'Journeys', icon: MapPin, description: 'Community journeys, seat utilization' },
  { href: '/insights/finance', label: 'Finance', icon: DollarSign, description: 'Revenue, payments, refunds, payouts' },
  { href: '/insights/geography', label: 'Geography', icon: Globe, description: 'Cities, zones, demand' },
  { href: '/insights/reports', label: 'Reports', icon: FileText, description: 'Downloadable reports' },
];

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Insights" description="Analytics and reports across the Falcon Rider marketplace" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="block">
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardContent className="pt-6">
                <s.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 text-base font-semibold">{s.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}