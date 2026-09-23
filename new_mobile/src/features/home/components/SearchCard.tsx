// src/features/home/components/SearchCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type SearchCardProps = {
  onPress: () => void;
  label?: string;
};

export function SearchCard({
  onPress,
  label = 'Where are you going?',
}: SearchCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.background,
          borderColor: theme.primary,
          opacity: pressed ? 0.9 : 1,
        },
        Shadows.sm,
      ]}
    >
      <Ionicons name="search" size={22} color={theme.primary} />

      <ThemedText
        type="body"
        themeColor="textSecondary"
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </ThemedText>

      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 64,
    paddingHorizontal: Spacing.four,
    borderRadius: Radii.lg,
    borderWidth: 2,
  },
  label: {
    flex: 1,
  },
});