'use client';

import { useState } from 'react';
import { Users, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { StatusBadgeAuto } from '@/components/shared/status-badge';
import { useMatchingSession } from '@/features/operations/hooks/use-operations';
import { formatNumber } from '@/lib/utils/format';

export default function MatchingPage() {
  const [requestId, setRequestId] = useState('RQ-10847');
  const [activeId, setActiveId] = useState('RQ-10847');
  const { data, isLoading } = useMatchingSession(activeId);

  const handleSearch = () => {
    if (requestId.trim()) setActiveId(requestId.trim());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matching"
        description="Inspect backend-authoritative matching sessions for a request"
      />

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-6">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Request ID</label>
            <Input
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="RQ-10847"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>Load session</Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Loading…</CardContent></Card>
      ) : !data ? (
        <Card><CardContent className="py-12">
          <EmptyState
            icon={Users}
            title="No matching session"
            description={`No matching session found for ${activeId}.`}
          />
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Session {data.id}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Request {data.requestId} · {formatNumber(data.attemptCount)} attempts
                  </p>
                </div>
                <StatusBadgeAuto status={data.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <div className="text-xs text-muted-foreground">
                Started {new Date(data.startedAt).toLocaleString()}
                {data.completedAt && ` · Completed ${new Date(data.completedAt).toLocaleString()}`}
              </div>
              {data.matchedProviderId && (
                <div className="rounded-md border bg-emerald-50 p-3 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Matched to {data.matchedProviderId}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Candidates ({data.candidates.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {data.candidates.map((c) => (
                <div key={c.providerId} className="flex items-start justify-between gap-4 rounded-md border p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.providerName}</span>
                      <span className="font-mono text-xs text-muted-foreground">{c.providerId}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{c.distance} km away</span>
                      <span>{c.eta} min ETA</span>
                      <span>{c.vehicleType}</span>
                      {c.rating !== undefined && <span>⭐ {c.rating}</span>}
                    </div>
                    {c.rejectedReason && (
                      <div className="mt-1 text-xs text-red-600">Rejected: {c.rejectedReason}</div>
                    )}
                  </div>
                  <div>
                    {c.accepted ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        ACCEPTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <XCircle className="h-3 w-3" />
                        NOT SELECTED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}