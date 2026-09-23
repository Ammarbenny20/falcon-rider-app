// src/components/ui/MenuItem.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
  badge?: string | number;
  disabled?: boolean;
};

export function MenuItem({
  icon,
  label,
  onPress,
  tone = 'default',
  badge,
  disabled,
}: MenuItemProps) {
  const theme = useTheme();
  const isDanger = tone === 'danger';

  const color = isDanger ? theme.danger : theme.text;
  const iconColor = isDanger ? theme.danger : theme.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.row,
        { opacity: disabled ? 0.5 : pressed ? 0.7 : 1 },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: isDanger
              ? 'rgba(217, 75, 75, 0.12)'
              : theme.backgroundSelected,
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      <ThemedText type="body" style={[styles.label, { color }]}>
        {label}
      </ThemedText>

      {badge !== undefined ? (
        <View
          style={[styles.badge, { backgroundColor: theme.primary }]}
        >
          <ThemedText type="caption" style={styles.badgeText}>
            {badge}
          </ThemedText>
        </View>
      ) : null}

      {!isDanger ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.textSecondary}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    minHeight: 56,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  badgeText: { color: '#FFFFFF', fontWeight: '700' },
});