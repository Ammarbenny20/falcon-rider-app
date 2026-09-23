'use client';

/**
 * Falcon Rider Admin Portal — Suspend Provider Dialog
 */

import { useState } from 'react';
import { Ban } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSuspendProvider } from '../hooks/use-providers';
import type { Provider } from '../types/provider.types';

interface SuspendProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider | null;
}

export function SuspendProviderDialog({
  open,
  onOpenChange,
  provider,
}: SuspendProviderDialogProps) {
  const [reason, setReason] = useState('');
  const mutation = useSuspendProvider();

  const handleConfirm = async () => {
    if (!provider) return;
    if (!reason.trim()) {
      toast.error('Reason is required');
      return;
    }
    try {
      await mutation.mutateAsync({ id: provider.id, reason });
      toast.success(`${provider.fullName} has been suspended`);
      onOpenChange(false);
      setReason('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Suspend failed'
      );
    }
  };

  if (!provider) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Ban className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <AlertDialogTitle>Suspend provider account</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately suspend{' '}
                <span className="font-medium">{provider.fullName}</span> (
                {provider.id}). They will not be able to receive new bookings.
                This action is auditable.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="suspend-reason">
            Reason <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="suspend-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this provider is being suspended…"
            rows={3}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={mutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {mutation.isPending ? 'Suspending…' : 'Suspend provider'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}