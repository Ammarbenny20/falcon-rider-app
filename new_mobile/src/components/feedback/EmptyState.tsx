// src/components/feedback/EmptyState.tsx

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon = 'leaf-outline',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: theme.backgroundSelected },
        ]}
      >
        <Ionicons name={icon} size={40} color={theme.primary} />
      </View>

      <ThemedText type="title3" style={styles.center}>
        {title}
      </ThemedText>

      {description ? (
        <ThemedText
          type="body"
          themeColor="textSecondary"
          style={styles.center}
        >
          {description}
        </ThemedText>
      ) : null}

      {actionLabel && onAction ? (
        <View style={styles.actionWrap}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.nine,
    paddingHorizontal: Spacing.five,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  center: {
    textAlign: 'center',
    maxWidth: 320,
  },
  actionWrap: {
    marginTop: Spacing.two,
    minWidth: 200,
  },
});