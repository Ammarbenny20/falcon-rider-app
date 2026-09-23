import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'Bookings' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title='Bookings' description='Coming soon' />
      <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
        Bookings — coming soon
      </div>
    </div>
  );
}
