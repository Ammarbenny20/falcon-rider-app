'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/shared/loading-state';
import { EmptyState } from '@/components/shared/empty-state';
import { notificationsApi } from '@/features/notifications/api/notifications.api';
import type {
  AppNotification,
  NotificationSeverity,
} from '@/features/notifications/types/notifications.types';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';

const SEVERITY_STYLES: Record<NotificationSeverity, string> = {
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
};

const SEVERITY_ICONS: Record<
  NotificationSeverity,
  React.ComponentType<{ className?: string }>
> = {
  info: Info,
  warning: AlertTriangle,
  danger: XCircle,
  success: CheckCircle2,
};

export default function NotificationsAdminPage() {
  const { data, isLoading } = useQuery<AppNotification[]>({
    queryKey: ['notifications', 'admin'],
    queryFn: () => notificationsApi.list(),
    refetchInterval: 30_000,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="All admin notifications and alerts"
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.map((n: AppNotification) => {
            const Icon = SEVERITY_ICONS[n.severity];
            const content = (
              <Card
                className={cn(
                  'transition-colors hover:bg-muted/40',
                  !n.read && 'border-l-4 border-l-primary'
                )}
              >
                <CardContent className="flex items-start gap-4 py-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      SEVERITY_STYLES[n.severity]
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-medium">{n.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {n.severity}
                        </Badge>
                        {!n.read && (
                          <Badge variant="default" className="text-[10px]">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </div>
                    {n.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {n.description}
                      </p>
                    )}
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );

            return n.href ? (
              <Link key={n.id} href={n.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}