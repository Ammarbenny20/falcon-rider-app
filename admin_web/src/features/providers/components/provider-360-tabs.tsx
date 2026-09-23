'use client';

/**
 * Falcon Rider Admin Portal — Provider 360 Tabs
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProviderOverview } from './provider-overview';
import { ProviderVehiclesTab } from './provider-vehicles-tab';
import { ProviderDocumentsTab } from './provider-documents-tab';
import { EmptyState } from '@/components/shared/empty-state';
import { ShieldCheck } from 'lucide-react';
import type { Provider360 } from '../types/provider.types';

export function Provider360Tabs({ provider }: { provider: Provider360 }) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="flex flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
        <TabsTrigger value="vehicles">
          Vehicles ({provider.vehicles.length})
        </TabsTrigger>
        <TabsTrigger value="documents">
          Documents ({provider.documents.length})
        </TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="earnings">Earnings</TabsTrigger>
        <TabsTrigger value="audit">Audit</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ProviderOverview provider={provider} />
      </TabsContent>

      <TabsContent value="verification">
        <EmptyState
          icon={ShieldCheck}
          title="Verification workflow"
          description="Verification review UI will appear here (backend-dependent)."
        />
      </TabsContent>

      <TabsContent value="vehicles">
        <ProviderVehiclesTab vehicles={provider.vehicles} />
      </TabsContent>

      <TabsContent value="documents">
        <ProviderDocumentsTab documents={provider.documents} />
      </TabsContent>

      <TabsContent value="activity">
        <EmptyState
          title="Activity"
          description="Recent trips and journeys will appear here."
        />
      </TabsContent>

      <TabsContent value="earnings">
        <EmptyState
          title="Earnings"
          description="Earnings history will appear here."
        />
      </TabsContent>

      <TabsContent value="audit">
        <EmptyState
          title="Audit history"
          description="Provider audit trail will appear here."
        />
      </TabsContent>
    </Tabs>
  );
}