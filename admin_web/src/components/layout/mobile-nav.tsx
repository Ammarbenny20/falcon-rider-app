'use client';

/**
 * Falcon Rider Admin Portal — Mobile Navigation
 *
 * Drawer navigation for mobile screens.
 */

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}