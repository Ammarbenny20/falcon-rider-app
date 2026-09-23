// src/app/(tabs)/settings/appearance.tsx

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
  type AppThemePreference,
} from '@/store/preferences.store';
import { useTheme } from '@/hooks/use-theme';

const THEMES: {
  value: AppThemePreference;
  labelKey:
    | 'settings.appearance.system'
    | 'settings.appearance.light'
    | 'settings.appearance.dark';
  icon: 'phone-portrait-outline' | 'sunny-outline' | 'moon-outline';
}[] = [
  {
    value: 'system',
    labelKey: 'settings.appearance.system',
    icon: 'phone-portrait-outline',
  },
  { value: 'light', labelKey: 'settings.appearance.light', icon: 'sunny-outline' },
  { value: 'dark', labelKey: 'settings.appearance.dark', icon: 'moon-outline' },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslation();

  const current = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">{t('settings.appearance.title')}</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Card style={styles.card}>
          {THEMES.map((item, index) => {
            const selected = current === item.value;
            return (
              <View key={item.value}>
                <Pressable
                  onPress={() => setTheme(item.value)}
                  style={styles.row}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={theme.textSecondary}
                  />
                  <ThemedText type="body" style={{ flex: 1 }}>
                    {t(item.labelKey)}
                  </ThemedText>
                  {selected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={theme.primary}
                    />
                  ) : null}
                </Pressable>
                {index < THEMES.length - 1 ? (
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
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    minHeight: 56,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.four + 22 + Spacing.three,
  },
});