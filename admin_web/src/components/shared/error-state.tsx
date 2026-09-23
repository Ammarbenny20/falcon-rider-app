/**
 * Falcon Rider Admin Portal — Error States
 *
 * Consistent error UI with retry capability.
 */

'use client';

import { AlertCircle, RefreshCw, WifiOff, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\'t load this data. Please try again.',
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        {error && process.env.NODE_ENV === 'development' && (
          <pre className="mt-2 max-w-md overflow-auto rounded bg-muted p-2 text-left text-xs">
            {error.message}
          </pre>
        )}
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <WifiOff className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Connection problem</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Please check your internet connection and try again.
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}

export function ForbiddenError() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <ShieldAlert className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Access denied</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          You don't have permission to view this resource.
        </p>
      </div>
    </div>
  );
}