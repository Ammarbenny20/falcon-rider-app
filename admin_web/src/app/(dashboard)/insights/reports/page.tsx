import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'Reports' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title='Reports' description='This analytics view is coming soon.' />
      <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
        Analytics — coming soon
      </div>
    </div>
  );
}
