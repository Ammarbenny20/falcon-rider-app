'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/shared/loading-state';
import { useSettings, useUpdateSettings } from '@/features/governance/hooks/use-governance';
import type { PlatformSettings } from '@/features/governance/types/governance.types';

export default function SettingsPage() {
  const { data, isLoading } = useSettings();
  const mutation = useUpdateSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<Partial<PlatformSettings>>();

  useEffect(() => {
    if (data) {
      reset({
        professionalCommissionRate: data.professionalCommissionRate,
        communityCommissionRate: data.communityCommissionRate,
        payoutMinimumThreshold: data.payoutMinimumThreshold,
        payoutOnDemandFee: data.payoutOnDemandFee,
        receiptPdfEnabled: data.receiptPdfEnabled,
        demoMode: data.demoMode,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: Partial<PlatformSettings>) => {
    try {
      await mutation.mutateAsync(values);
      toast.success('Settings updated successfully');
    } catch {
      toast.error('Failed to update settings');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Platform Settings" description="Configure platform behavior" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
              <CardContent><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        title="Platform Settings"
        description="Configure commission rates, payouts, and platform behavior"
        actions={
          <Button type="submit" disabled={!isDirty || mutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Commission Rates</CardTitle>
          <CardDescription>
            Percentage the platform takes from each trip. Snapshot at booking time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="professionalCommissionRate">
                Professional Commission Rate
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="professionalCommissionRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  {...register('professionalCommissionRate', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">
                  {((watch('professionalCommissionRate') ?? 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="communityCommissionRate">
                Community Commission Rate
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="communityCommissionRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  {...register('communityCommissionRate', { valueAsNumber: true })}
                />
                <span className="text-sm text-muted-foreground">
                  {((watch('communityCommissionRate') ?? 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payouts</CardTitle>
          <CardDescription>Provider payout configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payoutMinimumThreshold">
                Minimum Payout Threshold (TZS)
              </Label>
              <Input
                id="payoutMinimumThreshold"
                type="number"
                {...register('payoutMinimumThreshold', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payoutOnDemandFee">
                On-Demand Payout Fee (TZS)
              </Label>
              <Input
                id="payoutOnDemandFee"
                type="number"
                {...register('payoutOnDemandFee', { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Behavior</CardTitle>
          <CardDescription>General platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="receiptPdfEnabled" className="cursor-pointer">
                Receipt PDF Generation
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow customers to download PDF receipts
              </p>
            </div>
            <Switch
              id="receiptPdfEnabled"
              checked={watch('receiptPdfEnabled') ?? false}
              onCheckedChange={(v) => setValue('receiptPdfEnabled', v, { shouldDirty: true })}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="demoMode" className="cursor-pointer">
                Demo Mode
              </Label>
              <p className="text-xs text-muted-foreground">
                Simulate external services (payment, SMS, GPS)
              </p>
            </div>
            <Switch
              id="demoMode"
              checked={watch('demoMode') ?? false}
              onCheckedChange={(v) => setValue('demoMode', v, { shouldDirty: true })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Contact</CardTitle>
          <CardDescription>Displayed in receipts and support pages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" {...register('supportEmail')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input id="supportPhone" type="tel" {...register('supportPhone')} />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}