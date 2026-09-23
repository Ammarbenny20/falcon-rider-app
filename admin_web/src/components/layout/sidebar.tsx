'use client';

/**
 * Falcon Rider Admin Portal â€” Sidebar
 *
 * Primary navigation.
 * Filters items by user permissions.
 * Collapsible on desktop, drawer on mobile.
 */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { navigation } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { useAuth } from '@/features/auth/hooks/use-auth';
import type { Permission } from '@/config/permissions';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r bg-background',
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/command-center" className="flex items-center gap-2" onClick={onNavigate}>
          <Image src="/images/logo.svg" alt="Falcon Rider" width={32} height={32} className="rounded-lg" priority />
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">
              {siteConfig.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Command Center
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {navigation.map((section) => {
            const visibleItems = section.items.filter((item) =>
              hasPermission(item.permission as Permission)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title}>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + '/');

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          v{siteConfig.version}
        </p>
      </div>
    </aside>
  );
}

