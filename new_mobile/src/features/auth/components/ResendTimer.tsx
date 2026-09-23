// src/features/auth/components/ResendTimer.tsx

import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';

type ResendTimerProps = {
  seconds?: number;
  onResend: () => void;
  isResending?: boolean;
};

export function ResendTimer({
  seconds = 30,
  onResend,
  isResending,
}: ResendTimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  if (remaining > 0) {
    return (
      <ThemedText type="small" themeColor="textSecondary">
        Resend code in {remaining}s
      </ThemedText>
    );
  }

  return (
    <Button
      label="Resend code"
      variant="ghost"
      onPress={onResend}
      loading={isResending}
    />
  );
}