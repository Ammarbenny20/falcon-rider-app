'use client';

import Link from 'next/link';
import {
  Shield, AlertCircle, FileText, ShieldAlert, FileCheck, LifeBuoy,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/loading-state';
import { formatNumber } from '@/lib/utils/format';
import { useSafetyOverview } from '@/features/safety/hooks/use-safety';

const SECTIONS = [
  { href: '/safety/incidents', label: 'Incidents', icon: Shield, description: 'Safety incidents — reported → triaged → resolved' },
  { href: '/safety/reports', label: 'Reports', icon: FileText, description: 'Customer/provider reports' },
  { href: '/safety/emergency', label: 'Emergency Events', icon: ShieldAlert, description: 'SOS alerts, emergency triage' },
  { href: '/safety/restrictions', label: 'Restrictions', icon: AlertCircle, description: 'Account suspensions, warnings' },
  { href: '/safety/appeals', label: 'Appeals', icon: FileCheck, description: 'Restriction appeals' },
  { href: '/safety/support', label: 'Support Cases', icon: LifeBuoy, description: 'Customer/provider support' },
];

export default function SafetyOverviewPage() {
  const { data, isLoading } = useSafetyOverview();

  const stats = [
    { label: 'Active Incidents', value: data?.activeIncidents ?? 0, accent: 'text-amber-600' },
    { label: 'Critical', value: data?.criticalIncidents ?? 0, accent: 'text-red-600' },
    { label: 'Active Emergencies', value: data?.activeEmergencies ?? 0, accent: 'text-red-700' },
    { label: 'Open Reports', value: data?.openReports ?? 0, accent: 'text-amber-700' },
    { label: 'Open Appeals', value: data?.openAppeals ?? 0, accent: 'text-blue-600' },
    { label: 'Open Support', value: data?.openSupportCases ?? 0, accent: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety & Support"
        description="Trust & safety center — incidents, reports, emergencies, restrictions, appeals, support"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="pt-5"><Skeleton className="h-7 w-12" /><Skeleton className="mt-2 h-3 w-24" /></CardContent></Card>
            ))
          : stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-5">
                  <div className={`text-2xl font-semibold tabular-nums ${s.accent}`}>
                    {formatNumber(s.value)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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