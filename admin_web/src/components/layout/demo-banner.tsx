'use client';

/**
 * Demo Banner — shown when DEMO_MODE is on.
 */

import { FlaskConical } from 'lucide-react';
import { env } from '@/config/env';

export function DemoBanner() {
  if (!env.DEMO_MODE) return null;

  return (
    <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
      <FlaskConical className="h-3.5 w-3.5" />
      Demo Mode — simulated external services, real core logic
    </div>
  );
}