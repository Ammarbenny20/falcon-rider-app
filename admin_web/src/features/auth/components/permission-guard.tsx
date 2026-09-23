'use client';

/**
 * Falcon Rider Admin Portal — Permission Guard
 *
 * Conditionally renders children based on permissions.
 */

import { useAuth } from '../hooks/use-auth';
import type { Permission } from '@/config/permissions';

interface PermissionGuardProps {
  permission: Permission | Permission[];
  mode?: 'any' | 'all';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  permission,
  mode = 'any',
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasAccess =
    mode === 'all' ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}