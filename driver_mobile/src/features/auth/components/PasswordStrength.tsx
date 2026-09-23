// src/features/auth/components/PasswordStrength.tsx

import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type Strength = 'weak' | 'fair' | 'good' | 'strong';

function analyze(password: string): {
  strength: Strength;
  score: number;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++;

  let strength: Strength;
  if (score <= 2) strength = 'weak';
  else if (score === 3) strength = 'fair';
  else if (score === 4) strength = 'good';
  else strength = 'strong';

  return { strength, score };
}

function labelFor(strength: Strength): string {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'fair':
      return 'Fair';
    case 'good':
      return 'Good';
    case 'strong':
      return 'Strong';
  }
}

type PasswordStrengthProps = {
  password: string;
};

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const theme = useTheme();

  if (!password) return null;

  const { strength, score } = analyze(password);

  const colorFor = (i: number): string => {
    if (i >= score) return theme.border;
    switch (strength) {
      case 'weak':
        return theme.danger;
      case 'fair':
        return theme.warning;
      case 'good':
        return theme.success;
      case 'strong':
        return theme.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            style={[styles.bar, { backgroundColor: colorFor(i) }]}
          />
        ))}
      </View>
      <ThemedText type="caption" themeColor="textSecondary">
        {labelFor(strength)}
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