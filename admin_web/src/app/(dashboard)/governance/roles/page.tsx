'use client';

import { Shield, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/shared/loading-state';
import { useRoles } from '@/features/governance/hooks/use-governance';
import type { RoleDefinition } from '@/features/governance/types/governance.types';

export default function RolesPage() {
  const { data: roles, isLoading } = useRoles();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Static role catalog — permissions are assigned to roles by the backend"
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles?.map((role: RoleDefinition) => (
            <Card key={role.name}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="h-4 w-4 text-primary" />
                      {role.label}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 gap-1">
                    <Users className="h-3 w-3" />
                    {role.userCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    {role.permissions.length} permissions
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 6).map((p: string) => (
                      <span
                        key={p}
                        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]"
                      >
                        {p}
                      </span>
                    ))}
                    {role.permissions.length > 6 && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{role.permissions.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}