import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'Forgot Password' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title='Forgot Password' description='Coming soon' />
      <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
        Forgot Password — coming soon
      </div>
    </div>
  );
}
