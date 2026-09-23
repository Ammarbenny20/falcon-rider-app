'use client';

/**
 * Falcon Rider Admin Portal — Provider 360 Header
 *
 * Identity, status, capabilities at a glance.
 */

import { Mail, Phone, MapPin, Star, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { getInitials, formatDate, formatNumber } from '@/lib/utils/format';
import type { Provider360 } from '../types/provider.types';

interface Provider360HeaderProps {
  provider: Provider360;
}

export function Provider360Header({ provider }: Provider360HeaderProps) {
  return (
    <div className="rounded-lg border bg-background p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar className="h-20 w-20 shrink-0">
          {provider.avatarUrl && (
            <AvatarImage src={provider.avatarUrl} alt={provider.fullName} />
          )}
          <AvatarFallback className="text-lg">
            {getInitials(provider.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {provider.fullName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {provider.id} · {provider.userId}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadgeAuto status={provider.accountStatus} />
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem icon={Phone} label="Phone" value={provider.phone} />
            {provider.email && (
              <InfoItem icon={Mail} label="Email" value={provider.email} />
            )}
            {provider.city && (
              <InfoItem
                icon={MapPin}
                label="Location"
                value={`${provider.city}, ${provider.country ?? ''}`}
              />
            )}
            <InfoItem
              icon={Calendar}
              label="Joined"
              value={formatDate(provider.createdAt)}
            />
            {provider.rating !== undefined && (
              <InfoItem
                icon={Star}
                label="Rating"
                value={`${provider.rating.toFixed(2)} (${formatNumber(provider.totalTrips ?? 0)} trips)`}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-4 border-t pt-4">
            <CapabilityBlock
              title="Professional"
              status={provider.professionalCapability}
              availability={
                provider.professionalCapability !== 'NOT_REQUESTED'
                  ? provider.professionalAvailability
                  : null
              }
            />
            <CapabilityBlock
              title="Community"
              status={provider.communityCapability}
            />
            <CapabilityBlock
              title="Identity"
              status={provider.identityVerification}
            />
            <CapabilityBlock
              title="Phone"
              status={provider.phoneVerification}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}

function CapabilityBlock({
  title,
  status,
  availability,
}: {
  title: string;
  status: string;
  availability?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      <StatusBadgeAuto status={status} />
      {availability && <StatusBadgeAuto status={availability} />}
    </div>
  );
}