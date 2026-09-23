'use client';

/**
 * Action Center Panel — work requiring human intervention.
 */

import Link from 'next/link';
import { AlertCircle, ArrowRight, Clock, ShieldAlert, DollarSign, UserCheck, CreditCard, LifeBuoy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/loading-state';
import { EmptyState } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import type { ActionItem, ActionCategory, ActionPriority } from '../types/dashboard.types';

interface Props {
  items?: ActionItem[];
  isLoading?: boolean;
}

const PRIORITY_STYLES: Record<ActionPriority, string> = {
  CRITICAL: 'border-l-red-500 bg-red-50/60 dark:bg-red-950/20',
  HIGH: 'border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/20',
  MEDIUM: 'border-l-blue-500 bg-blue-50/40 dark:bg-blue-950/20',
  LOW: 'border-l-gray-400 bg-muted/30',
};

const PRIORITY_LABEL: Record<ActionPriority, string> = {
  CRITICAL: 'text-red-700 dark:text-red-400',
  HIGH: 'text-amber-700 dark:text-amber-400',
  MEDIUM: 'text-blue-700 dark:text-blue-400',
  LOW: 'text-muted-foreground',
};

const CATEGORY_ICON: Record<ActionCategory, React.ComponentType<{ className?: string }>> = {
  VERIFICATION: UserCheck,
  SCHEDULED_TRIP_RISK: Clock,
  UNMATCHED_REQUEST: AlertCircle,
  PAYMENT_EXCEPTION: CreditCard,
  SAFETY_INCIDENT: ShieldAlert,
  REFUND_REQUEST: DollarSign,
  PAYOUT_FAILURE: DollarSign,
  SUPPORT_SLA: LifeBuoy,
  NOTIFICATION_FAILURE: AlertCircle,
  SYSTEM_ERROR: AlertCircle,
};

export function ActionCenterPanel({ items, isLoading }: Props) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          Action Center
        </CardTitle>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          {items?.length ?? 0} open
        </span>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-md border p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-full" />
                <Skeleton className="mt-2 h-7 w-24" />
              </div>
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <EmptyState
            title="All clear"
            description="No items need attention right now."
          />
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <ActionCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActionCard({ item }: { item: ActionItem }) {
  const Icon = CATEGORY_ICON[item.category];

  return (
    <div
      className={cn(
        'rounded-md border border-l-4 p-3 transition-colors hover:bg-muted/30',
        PRIORITY_STYLES[item.priority]
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium leading-tight">{item.title}</h4>
            <span
              className={cn(
                'shrink-0 text-[10px] font-semibold uppercase tracking-wider',
                PRIORITY_LABEL[item.priority]
              )}
            >
              {item.priority}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{item.description}</p>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-mono">{item.entityLabel}</span>
              <span>·</span>
              <span>{formatRelativeTime(item.createdAt)}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.actions.map((action, i) => (
              <Button
                key={i}
                asChild={!!action.href}
                variant={action.variant ?? 'outline'}
                size="sm"
                className="h-7 text-xs"
              >
                {action.href ? <Link href={action.href}>{action.label}</Link> : <span>{action.label}</span>}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}