'use client';

/**
 * Falcon Rider Admin Portal — Command Palette (⌘K)
 *
 * Global search and navigation.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Search, Users, Car, Activity, Wallet, FileText, MapPin, Shield,
  AlertCircle, BarChart3, Settings, UserCog, Bell, LayoutDashboard,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { searchApi } from '../api/search.api';
import type { SearchEntityType } from '../types/search.types';

const TYPE_ICONS: Record<SearchEntityType, React.ComponentType<{ className?: string }>> = {
  CUSTOMER: Users,
  PROVIDER: Car,
  TRIP: Activity,
  BOOKING: Activity,
  REQUEST: Activity,
  PAYMENT: Wallet,
  RECEIPT: FileText,
  JOURNEY: MapPin,
  INCIDENT: Shield,
  SUPPORT_CASE: AlertCircle,
  DISPUTE: AlertCircle,
  AUDIT_LOG: FileText,
};

const QUICK_NAV = [
  { label: 'Command Center', href: '/command-center', icon: LayoutDashboard },
  { label: 'Action Center', href: '/action-center', icon: AlertCircle },
  { label: 'Live Operations', href: '/operations/live', icon: Activity },
  { label: 'Providers', href: '/people/providers', icon: Car },
  { label: 'Customers', href: '/people/customers', icon: Users },
  { label: 'Payments', href: '/money/payments', icon: Wallet },
  { label: 'Refunds', href: '/money/refunds', icon: Wallet },
  { label: 'Disputes', href: '/money/disputes', icon: AlertCircle },
  { label: 'Incidents', href: '/safety/incidents', icon: Shield },
  { label: 'Analytics', href: '/insights/marketplace', icon: BarChart3 },
  { label: 'Audit Log', href: '/governance/audit', icon: FileText },
  { label: 'Settings', href: '/governance/settings', icon: Settings },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['search', 'global', debouncedQuery],
    queryFn: () => searchApi.global(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="ml-auto hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
          <span>⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search customers, providers, trips, payments…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {query.length < 2
              ? 'Type at least 2 characters to search'
              : isLoading
                ? 'Searching…'
                : 'No results found'}
          </CommandEmpty>

          {/* Search results */}
          {groups.length > 0 &&
            groups.map((group, idx) => (
              <div key={group.type}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={group.label}>
                  {group.results.map((result) => {
                    const Icon = TYPE_ICONS[result.type];
                    return (
                      <CommandItem
                        key={`${result.type}-${result.id}`}
                        onSelect={() => handleSelect(result.href)}
                        className="flex items-center gap-3"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-sm font-medium">{result.label}</div>
                          {result.description && (
                            <div className="truncate text-xs text-muted-foreground">
                              {result.description}
                            </div>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {result.id}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            ))}

          {/* Quick navigation when no query */}
          {query.length < 2 && (
            <CommandGroup heading="Quick Navigation">
              {QUICK_NAV.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => handleSelect(item.href)}
                  className="flex items-center gap-3"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}