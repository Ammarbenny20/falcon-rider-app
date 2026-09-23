'use client';

/**
 * Falcon Rider Admin Portal — Header
 */

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from './user-menu';
import { CommandPalette } from '@/features/search/components/command-palette';
import { NotificationsDropdown } from '@/features/notifications/components/notifications-dropdown';
import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center">
        <CommandPalette />
      </div>

      <div className="flex items-center gap-2">
        <NotificationsDropdown />
        <UserMenu />
      </div>
    </header>
  );
}