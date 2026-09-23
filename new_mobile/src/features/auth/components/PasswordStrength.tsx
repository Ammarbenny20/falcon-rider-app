// src/features/auth/components/PasswordStrength.tsx

import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import {
  analyzePassword,
  strengthLabel,
  type PasswordStrength as Strength,
} from '@/features/auth/utils/password';
import { useTheme } from '@/hooks/use-theme';

type PasswordStrengthProps = {
  password: string;
};

const SEGMENTS = 4;

function strengthToSegments(strength: Strength): number {
  switch (strength) {
    case 'weak':
      return 1;
    case 'fair':
      return 2;
    case 'good':
      return 3;
    case 'strong':
      return 4;
  }
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const theme = useTheme();

  if (!password) return null;

  const analysis = analyzePassword(password);
  const filled = strengthToSegments(analysis.strength);

  const colorFor = (i: number): string => {
    if (i >= filled) return theme.border;
    switch (analysis.strength) {
      case 'weak':
        return theme.danger;
      case 'fair':
        return '#F5A524';
      case 'good':
        return '#30A46C';
      case 'strong':
        return theme.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <View
            key={i}
            style={[styles.bar, { backgroundColor: colorFor(i) }]}
          />
        ))}
      </View>

      <ThemedText type="caption" themeColor="textSecondary">
        {strengthLabel(analysis.strength)}
        {analysis.suggestions.length > 0
          ? ` · ${analysis.suggestions[0]}`
          : ''}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.one },
  barsRow: { flexDirection: 'row', gap: Spacing.one },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: Radii.full,
  },
});