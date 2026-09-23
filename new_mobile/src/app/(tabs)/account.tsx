// src/app/(tabs)/account.tsx

import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { LoadingState } from '@/components/feedback/LoadingState';
import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { MenuItem } from '@/components/ui/MenuItem';
import { Section } from '@/components/ui/Section';
import { Spacing } from '@/constants/spacing';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useMe } from '@/features/auth/hooks/useMe';
import { useSession } from '@/features/auth/hooks/useSession';
import { useTranslation } from '@/i18n';
import { usePreferencesStore } from '@/store/preferences.store';
import { useTheme } from '@/hooks/use-theme';

export default function AccountScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslation();

  const { user: cachedUser, isAuthenticated } = useSession();
  const { data: fetchedUser, isLoading } = useMe();
  const logout = useLogout();

  const language = usePreferencesStore((s) => s.language);
  const themePreference = usePreferencesStore((s) => s.theme);

  const user = fetchedUser ?? cachedUser;

  if (isLoading && !user) {
    return <LoadingState message="Loading your account…" />;
  }

  if (!isAuthenticated || !user) {
    return <LoadingState message="Loading…" />;
  }

  const contactLine = user.phone_number ?? user.email ?? '—';
  const avatarName = user.full_name?.trim() || contactLine;

  const languageLabel =
    language === 'sw'
      ? t('settings.language.swahili')
      : t('settings.language.english');

  const themeLabel =
    themePreference === 'system'
      ? t('settings.appearance.system')
      : themePreference === 'light'
        ? t('settings.appearance.light')
        : t('settings.appearance.dark');

  const handleLogout = () => {
    Alert.alert(
      t('account.logout.confirmTitle'),
      t('account.logout.confirmMessage'),
      [
        { text: t('account.logout.confirmCancel'), style: 'cancel' },
        {
          text: t('account.logout.confirmAction'),
          style: 'destructive',
          onPress: () => logout.mutate(),
        },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View style={styles.header}>
          <Avatar name={avatarName} size={80} />
          <View style={styles.headerText}>
            <ThemedText type="title2">
              {user.full_name || 'Falcon Rider user'}
            </ThemedText>
            <ThemedText type="body" themeColor="textSecondary">
              {contactLine}
            </ThemedText>
            <View style={styles.badgeWrap}>
              <Badge label={user.role} />
            </View>
          </View>
        </View>

        {/* Preferences */}
        <Section title={t('account.preferences')}>
          <MenuItem
            icon="language-outline"
            label={t('account.language')}
            badge={languageLabel}
            onPress={() => router.push('/settings/language')}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="color-palette-outline"
            label={t('account.appearance')}
            badge={themeLabel}
            onPress={() => router.push('/settings/appearance')}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="notifications-outline"
            label={t('account.notifications')}
            onPress={() => router.push('/settings/notifications')}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="bookmark-outline"
            label={t('account.savedPlaces')}
            onPress={() => router.push('/settings/saved-places')}
          />
        </Section>

        {/* Security */}
        <Section title={t('account.security')}>
          <MenuItem
            icon="shield-checkmark-outline"
            label={t('account.security')}
            onPress={() => router.push('/settings/security')}
          />
        </Section>

        {/* Support */}
        <Section title={t('account.support')}>
          <MenuItem
            icon="help-circle-outline"
            label={t('account.support')}
            onPress={() => router.push('/settings/support')}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="information-circle-outline"
            label={t('account.about')}
            onPress={() => router.push('/settings/about')}
          />
        </Section>

        {/* Logout */}
        <Section>
          <MenuItem
            icon="log-out-outline"
            label={t('account.logout')}
            tone="danger"
            onPress={handleLogout}
          />
        </Section>
      </ScrollView>
    </Screen>
  );
}

function Divider({ theme }: { theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.divider, { backgroundColor: theme.border }]} />
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: Spacing.five,
    paddingBottom: Spacing.eight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingTop: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: Spacing.one,
  },
  badgeWrap: {
    flexDirection: 'row',
    marginTop: Spacing.one,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.four + 36 + Spacing.three,
  },
});