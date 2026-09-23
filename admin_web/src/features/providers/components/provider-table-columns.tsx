'use client';

/**
 * Falcon Rider Admin Portal — Provider Table Columns
 *
 * Column definitions for provider table.
 */

import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, ShieldCheck, ShieldX, Ban } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { getInitials, formatDate, formatNumber } from '@/lib/utils/format';
import type { Provider } from '../types/provider.types';

interface ColumnsOptions {
  onVerify: (provider: Provider) => void;
  onSuspend: (provider: Provider) => void;
}

export function getProviderColumns({
  onVerify,
  onSuspend,
}: ColumnsOptions): ColumnDef<Provider>[] {
  return [
    {
      accessorKey: 'fullName',
      header: 'Provider',
      cell: ({ row }) => {
        const provider = row.original;
        return (
          <Link
            href={`/people/providers/${provider.id}`}
            className="flex items-center gap-3 hover:underline"
          >
            <Avatar className="h-9 w-9">
              {provider.avatarUrl && (
                <AvatarImage src={provider.avatarUrl} alt={provider.fullName} />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(provider.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{provider.fullName}</span>
              <span className="text-xs text-muted-foreground">
                {provider.id} · {provider.phone}
              </span>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: 'accountStatus',
      header: 'Account',
      cell: ({ row }) => (
        <StatusBadgeAuto status={row.original.accountStatus} />
      ),
    },
    {
      id: 'professional',
      header: 'Professional',
      cell: ({ row }) => (
        <StatusBadgeAuto status={row.original.professionalCapability} />
      ),
    },
    {
      id: 'community',
      header: 'Community',
      cell: ({ row }) => (
        <StatusBadgeAuto status={row.original.communityCapability} />
      ),
    },
    {
      id: 'availability',
      header: 'Availability',
      cell: ({ row }) => {
        const provider = row.original;
        if (provider.professionalCapability === 'NOT_REQUESTED') {
          return <span className="text-xs text-muted-foreground">—</span>;
        }
        return <StatusBadgeAuto status={provider.professionalAvailability} />;
      },
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.city ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
        const rating = row.original.rating;
        if (rating === undefined || rating === null) {
          return <span className="text-xs text-muted-foreground">No rating</span>;
        }
        return (
          <span className="text-sm font-medium">⭐ {rating.toFixed(2)}</span>
        );
      },
    },
    {
      id: 'activity',
      header: 'Activity',
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="text-xs text-muted-foreground">
            <div>{formatNumber(p.totalTrips ?? 0)} trips</div>
            <div>{formatNumber(p.totalJourneys ?? 0)} journeys</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const provider = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/people/providers/${provider.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Provider 360
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onVerify(provider)}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Review Verification
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onSuspend(provider)}
                className="text-destructive"
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspend Provider
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}