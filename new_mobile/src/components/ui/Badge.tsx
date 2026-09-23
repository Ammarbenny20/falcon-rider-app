import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BadgeProps = {
  label: string;
  tone?: 'neutral' | 'success' | 'danger';
};

export function Badge({
  label,
  tone = 'neutral',
}: BadgeProps) {
  const theme = useTheme();

  const backgroundColor =
    tone === 'success'
      ? theme.backgroundSelected
      : tone === 'danger'
        ? theme.danger
        : theme.backgroundElement;

  const textColor =
    tone === 'success'
      ? theme.primaryDark
      : tone === 'danger'
        ? '#FFFFFF'
        : theme.textSecondary;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText type="small" style={{ color: textColor }}>
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
    borderRadius: Spacing.four,
  },
});
