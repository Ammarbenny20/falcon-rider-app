// src/app/(tabs)/settings/about.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ThemedText } from '@/components/theme/ThemedText';
import { Spacing } from '@/constants/spacing';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';

export default function AboutScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">{t('settings.about.title')}</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <EmptyState
        icon="information-circle-outline"
        title={t('settings.about.title')}
        description={t('settings.comingSoon')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
});