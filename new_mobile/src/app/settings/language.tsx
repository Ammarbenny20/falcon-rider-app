// src/app/(tabs)/settings/language.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/theme/ThemedText';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { useTranslation } from '@/i18n';
import {
  usePreferencesStore,
  type AppLanguage,
} from '@/store/preferences.store';
import { useTheme } from '@/hooks/use-theme';

const LANGUAGES: { code: AppLanguage; labelKey: 'settings.language.english' | 'settings.language.swahili' }[] = [
  { code: 'en', labelKey: 'settings.language.english' },
  { code: 'sw', labelKey: 'settings.language.swahili' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslation();

  const current = usePreferencesStore((s) => s.language);
  const setLanguage = usePreferencesStore((s) => s.setLanguage);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">{t('settings.language.title')}</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Card style={styles.card}>
          {LANGUAGES.map((lang, index) => {
            const selected = current === lang.code;
            return (
              <View key={lang.code}>
                <Pressable
                  onPress={() => setLanguage(lang.code)}
                  style={styles.row}
                >
                  <ThemedText type="body" style={{ flex: 1 }}>
                    {t(lang.labelKey)}
                  </ThemedText>
                  {selected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={theme.primary}
                    />
                  ) : null}
                </Pressable>
                {index < LANGUAGES.length - 1 ? (
                  <View
                    style={[styles.divider, { backgroundColor: theme.border }]}
                  />
                ) : null}
              </View>
            );
          })}
        </Card>
      </ScrollView>
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
  body: { padding: Spacing.four },
  card: { padding: 0, gap: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    minHeight: 56,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.four,
  },
});