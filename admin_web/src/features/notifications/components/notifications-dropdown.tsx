'use client';

/**
 * Falcon Rider Admin Portal — Notifications Dropdown
 */

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import { notificationsApi } from '../api/notifications.api';
import type {
  AppNotification,
  NotificationSeverity,
} from '../types/notifications.types';

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

export function NotificationsDropdown() {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<AppNotification[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list(),
    refetchInterval: 30_000,
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                markAllMutation.mutate();
              }}
              disabled={markAllMutation.isPending}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="p-1">
              {notifications.map((n) => {
                const Icon = SEVERITY_ICONS[n.severity];
                const content = (
                  <div
                    className={cn(
                      'flex gap-3 rounded-md p-2 transition-colors hover:bg-muted',
                      !n.read && 'bg-muted/40'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        SEVERITY_STYLES[n.severity]
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm leading-tight',
                            !n.read && 'font-medium'
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      {n.description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {n.description}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>
                  </div>
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
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}