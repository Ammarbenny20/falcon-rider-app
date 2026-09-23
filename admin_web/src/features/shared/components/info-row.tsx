/**
 * Falcon Rider Admin Portal — Info Row
 *
 * Label-value pairs for detail pages.
 */

import { cn } from '@/lib/utils/cn';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b py-2 last:border-0', className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

interface InfoGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function InfoGrid({ children, columns = 2, className }: InfoGridProps) {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }[columns];

  return <div className={cn('grid gap-x-8 gap-y-1', cols, className)}>{children}</div>;
}