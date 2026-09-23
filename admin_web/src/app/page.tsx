'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FullPageLoader } from '@/components/shared/loading-state';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/command-center');
  }, [router]);

  return <FullPageLoader message="Loading Falcon Rider Command Center…" />;
}