import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'Provider Availability' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title='Provider Availability' description='Coming soon' />
      <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
        Provider Availability — coming soon
      </div>
    </div>
  );
}
