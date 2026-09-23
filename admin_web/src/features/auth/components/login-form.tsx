'use client';

/**
 * Falcon Rider Admin Portal — Login Form
 *
 * Real login with backend API.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '../store/auth.store';
import { apiClient } from '@/lib/api/client';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      // Real login with backend
      const response = await apiClient.post('/auth/login/', {
        identifier: data.email,
        password: data.password,
      });

      const { token, user } = response.data;

      // Map backend user to admin user
      const adminUser = {
        id: user.id,
        email: user.email || '',
        firstName: user.full_name?.split(' ')[0] || 'Admin',
        lastName: user.full_name?.split(' ').slice(1).join(' ') || '',
        fullName: user.full_name || 'Admin',
        role: user.role || 'ADMIN',
        permissions: Object.values({
          DASHBOARD_VIEW: 'dashboard.view',
          OPERATIONS_VIEW: 'operations.view',
          REQUESTS_VIEW: 'requests.view',
          MATCHING_VIEW: 'matching.view',
          MATCHING_INTERVENE: 'matching.intervene',
          TRIPS_VIEW: 'trips.view',
          TRIPS_LIVE: 'trips.live',
          TRIPS_INTERVENE: 'trips.intervene',
          BOOKINGS_VIEW: 'bookings.view',
          JOURNEYS_VIEW: 'journeys.view',
          CUSTOMERS_VIEW: 'customers.view',
          CUSTOMERS_EDIT: 'customers.edit',
          CUSTOMERS_SUSPEND: 'customers.suspend',
          PROVIDERS_VIEW: 'providers.view',
          PROVIDERS_VERIFY: 'providers.verify',
          PROVIDERS_SUSPEND: 'providers.suspend',
          VEHICLES_VIEW: 'vehicles.view',
          VEHICLES_MANAGE: 'vehicles.manage',
          DOCUMENTS_VIEW: 'documents.view',
          DOCUMENTS_VERIFY: 'documents.verify',
          PAYMENTS_VIEW: 'payments.view',
          PAYMENTS_REFUND: 'payments.refund',
          REFUNDS_VIEW: 'refunds.view',
          REFUNDS_APPROVE: 'refunds.approve',
          PAYOUTS_VIEW: 'payouts.view',
          PAYOUTS_APPROVE: 'payouts.approve',
          EARNINGS_VIEW: 'earnings.view',
          RECEIPTS_VIEW: 'receipts.view',
          DISPUTES_VIEW: 'disputes.view',
          DISPUTES_RESOLVE: 'disputes.resolve',
          RECONCILIATION_VIEW: 'reconciliation.view',
          RECONCILIATION_MANAGE: 'reconciliation.manage',
          SAFETY_VIEW: 'safety.view',
          SAFETY_INTERVENE: 'safety.intervene',
          SAFETY_ESCALATE: 'safety.escalate',
          ANALYTICS_VIEW: 'analytics.view',
          REPORTS_VIEW: 'reports.view',
          REPORTS_EXPORT: 'reports.export',
          NOTIFICATIONS_VIEW: 'notifications.view',
          NOTIFICATIONS_MANAGE: 'notifications.manage',
          STAFF_VIEW: 'staff.view',
          STAFF_MANAGE: 'staff.manage',
          ROLES_VIEW: 'roles.view',
          ROLES_MANAGE: 'roles.manage',
          AUDIT_VIEW: 'audit.view',
          SETTINGS_VIEW: 'settings.view',
          SETTINGS_MANAGE: 'settings.manage',
        }),
        isActive: true,
        createdAt: user.created_at || new Date().toISOString(),
      };

      login({
        user: adminUser,
        accessToken: token,
      });

      toast.success(`Welcome, ${adminUser.fullName}`);
      router.push('/command-center');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@falconrider.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Demo: falconrider2022@gmail.com / Admin123!
      </p>
    </form>
  );
}
