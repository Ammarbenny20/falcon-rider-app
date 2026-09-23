'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { DemoBanner } from '@/components/layout/demo-banner';
import { ProtectedRoute } from '@/features/auth/components/protected-route';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col overflow-hidden bg-muted/20">
        <DemoBanner />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header onMenuClick={() => setMobileNavOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}