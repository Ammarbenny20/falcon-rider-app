import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'Documents' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title='Documents' description='Coming soon' />
      <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
        Documents — coming soon
      </div>
    </div>
  );
}
