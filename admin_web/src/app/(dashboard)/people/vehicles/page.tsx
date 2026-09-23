import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'Vehicles' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title='Vehicles' description='Coming soon' />
      <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
        Vehicles — coming soon
      </div>
    </div>
  );
}
