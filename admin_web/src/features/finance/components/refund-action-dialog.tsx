'use client';

/**
 * Approve / Reject Refund Dialog
 */

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useApproveRefund, useRejectRefund } from '../hooks/use-finance';
import type { Refund } from '../types/finance.types';
import { formatCurrency } from '@/lib/utils/format';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refund: Refund | null;
  mode: 'APPROVE' | 'REJECT';
}

export function RefundActionDialog({ open, onOpenChange, refund, mode }: Props) {
  const [note, setNote] = useState('');
  const approveMutation = useApproveRefund();
  const rejectMutation = useRejectRefund();
  const isPending = approveMutation.isPending || rejectMutation.isPending;

  const handleConfirm = async () => {
    if (!refund) return;
    try {
      if (mode === 'APPROVE') {
        await approveMutation.mutateAsync({ id: refund.id, note });
        toast.success('Refund approved');
      } else {
        if (!note.trim()) {
          toast.error('Reason required');
          return;
        }
        await rejectMutation.mutateAsync({ id: refund.id, reason: note });
        toast.success('Refund rejected');
      }
      onOpenChange(false);
      setNote('');
    } catch {
      toast.error('Action failed');
    }
  };

  if (!refund) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'APPROVE' ? 'Approve refund' : 'Reject refund'}
          </DialogTitle>
          <DialogDescription>
            {refund.id} · {refund.customerName} ·{' '}
            {formatCurrency(refund.amount.amount, refund.amount.currency)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="note">
            {mode === 'APPROVE' ? 'Internal note (optional)' : 'Rejection reason'}
          </Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={mode === 'APPROVE' ? 'Optional note…' : 'Explain why…'}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className={mode === 'REJECT' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {isPending ? 'Processing…' : mode === 'APPROVE' ? 'Approve' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}