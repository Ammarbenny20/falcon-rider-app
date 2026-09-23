// src/components/ui/Badge.tsx

import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type BadgeTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const theme = useTheme();

  const colorFor: Record<BadgeTone, { bg: string; text: string }> = {
    neutral: {
      bg: theme.backgroundElement,
      text: theme.textSecondary,
    },
    success: {
      bg: 'rgba(48, 163, 108, 0.15)',
      text: theme.success,
    },
    danger: {
      bg: 'rgba(217, 75, 75, 0.15)',
      text: theme.danger,
    },
    warning: {
      bg: 'rgba(245, 165, 36, 0.15)',
      text: theme.warning,
    },
    info: {
      bg: 'rgba(0, 145, 255, 0.15)',
      text: theme.info,
    },
  };

  const colors = colorFor[tone];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
      ]}
    >
      <ThemedText
        type="caption"
        style={{ color: colors.text, fontWeight: '600' }}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radii.full,
  },
});