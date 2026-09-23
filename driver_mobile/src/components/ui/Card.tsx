// src/components/ui/Card.tsx

import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radii } from '@/constants/radii';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

export function Card({ style, children, ...rest }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
        Shadows.sm,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: Spacing.four,
  },
});