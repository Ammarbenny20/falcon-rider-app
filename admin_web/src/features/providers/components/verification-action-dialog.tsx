'use client';

/**
 * Falcon Rider Admin Portal — Verification Action Dialog
 *
 * Approve / Reject provider capability with reason.
 */

import { useState } from 'react';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVerifyProviderCapability } from '../hooks/use-providers';
import type {
  Provider,
  CapabilityType,
} from '../types/provider.types';

interface VerificationActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider | null;
}

export function VerificationActionDialog({
  open,
  onOpenChange,
  provider,
}: VerificationActionDialogProps) {
  const [capability, setCapability] = useState<CapabilityType>('PROFESSIONAL');
  const [action, setAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [reason, setReason] = useState('');

  const mutation = useVerifyProviderCapability();

  const handleSubmit = async () => {
    if (!provider) return;

    if (action === 'REJECT' && !reason.trim()) {
      toast.error('Reason is required when rejecting');
      return;
    }

    try {
      const result = await mutation.mutateAsync({
        providerId: provider.id,
        capability,
        action,
        reason: reason || undefined,
      });
      toast.success(result.message);
      onOpenChange(false);
      setReason('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Action failed'
      );
    }
  };

  if (!provider) return null;

  const isApprove = action === 'APPROVE';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={
                isApprove
                  ? 'flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700'
                  : 'flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive'
              }
            >
              {isApprove ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <ShieldX className="h-5 w-5" />
              )}
            </div>
            <div className="space-y-1">
              <DialogTitle>
                {isApprove ? 'Approve' : 'Reject'} capability
              </DialogTitle>
              <DialogDescription>
                {provider.fullName} · {provider.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Capability</Label>
            <Select
              value={capability}
              onValueChange={(v) => setCapability(v as CapabilityType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                <SelectItem value="COMMUNITY">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Action</Label>
            <Select
              value={action}
              onValueChange={(v) => setAction(v as 'APPROVE' | 'REJECT')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVE">Approve</SelectItem>
                <SelectItem value="REJECT">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason {action === 'REJECT' && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                action === 'APPROVE'
                  ? 'Optional internal note…'
                  : 'Explain why this capability is being rejected…'
              }
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className={
              isApprove
                ? ''
                : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            }
          >
            {mutation.isPending
              ? 'Processing…'
              : isApprove
                ? 'Approve'
                : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}