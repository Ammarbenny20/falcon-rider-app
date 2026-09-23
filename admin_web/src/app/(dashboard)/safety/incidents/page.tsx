'use client';

import { useMemo, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getIncidentColumns } from '@/features/safety/components/incident-table-columns';
import { useIncidents, useResolveIncident } from '@/features/safety/hooks/use-safety';
import type { SafetyIncident, IncidentListParams, IncidentStatus, IncidentSeverity } from '@/features/safety/types/safety.types';
import { useDebounce } from '@/lib/hooks/use-debounce';

const STATUS_OPTIONS: IncidentStatus[] = ['REPORTED', 'TRIAGED', 'INVESTIGATING', 'ACTION_REQUIRED', 'RESOLVED', 'CLOSED'];
const SEVERITY_OPTIONS: IncidentSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function IncidentsPage() {
  const [filters, setFilters] = useState<IncidentListParams>({ page: 1, pageSize: 20 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [target, setTarget] = useState<SafetyIncident | null>(null);
  const [resolution, setResolution] = useState('');

  const search = useDebounce(filters.search, 300);
  const { data, isLoading, isError, error, refetch } = useIncidents({ ...filters, search });
  const mutation = useResolveIncident();

  const columns = useMemo(() => getIncidentColumns({ onResolve: setTarget }), []);

  const handleResolve = async () => {
    if (!target) return;
    if (!resolution.trim()) {
      toast.error('Resolution required');
      return;
    }
    try {
      await mutation.mutateAsync({ id: target.id, resolution });
      toast.success('Incident resolved');
      setTarget(null);
      setResolution('');
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Incidents" description="Safety incidents across the marketplace" />

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        page={filters.page ?? 1}
        pageSize={filters.pageSize ?? 20}
        pageCount={data?.totalPages ?? 1}
        totalItems={data?.totalItems ?? 0}
        onPageChange={(page) => setFilters({ ...filters, page })}
        onPageSizeChange={(pageSize) => setFilters({ ...filters, pageSize, page: 1 })}
        sorting={sorting}
        onSortingChange={setSorting}
        toolbar={
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Search…" value={filters.search ?? ''} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="w-full sm:max-w-xs" />
            <Select value={filters.status ?? 'all'} onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : (v as IncidentStatus), page: 1 })}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.severity ?? 'all'} onValueChange={(v) => setFilters({ ...filters, severity: v === 'all' ? undefined : (v as IncidentSeverity), page: 1 })}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                {SEVERITY_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve incident</DialogTitle>
            <DialogDescription>{target?.id} · {target?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="resolution">Resolution notes</Label>
            <Textarea id="resolution" value={resolution} onChange={(e) => setResolution(e.target.value)} rows={4} placeholder="Describe resolution…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)} disabled={mutation.isPending}>Cancel</Button>
            <Button onClick={handleResolve} disabled={mutation.isPending}>{mutation.isPending ? 'Resolving…' : 'Resolve'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}