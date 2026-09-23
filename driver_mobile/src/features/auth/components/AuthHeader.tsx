// src/features/auth/components/AuthHeader.tsx

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
};

export function AuthHeader({
  title,
  subtitle,
  showBack = true,
}: AuthHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.backButton}
        >
          <ThemedText
            type="title2"
            style={{ color: theme.primary, lineHeight: 28 }}
          >
            ‹
          </ThemedText>
        </Pressable>
      ) : null}

      <ThemedText type="title1">{title}</ThemedText>

      {subtitle ? (
        <ThemedText type="body" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});