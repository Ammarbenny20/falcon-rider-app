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
import { useSession } from '@/features/auth/hooks/useSession';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';

export default function AccountScreen() {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslation();
  const { user, isAuthenticated } = useSession();
  const logout = useLogout();

  if (!isAuthenticated || !user) {
    return <LoadingState />;
  }

  const contactLine = user.phone_number ?? user.email ?? '—';
  const avatarName = user.full_name?.trim() || contactLine;

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), t('auth.logout.confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: () => logout.mutate(),
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Avatar name={avatarName} size={80} />
          <View style={styles.headerText}>
            <ThemedText type="title2">
              {user.full_name || 'Provider'}
            </ThemedText>
            <ThemedText type="body" themeColor="textSecondary">
              {contactLine}
            </ThemedText>
            <View style={styles.badgeWrap}>
              <Badge label={user.role} />
              {user.verification_status ? (
                <Badge label={user.verification_status} tone="success" />
              ) : null}
            </View>
          </View>
        </View>

        {/* Account */}
        <Section title={t('account.title')}>
          <MenuItem
            icon="person-outline"
            label={t('account.profile')}
            onPress={() => router.push('/settings/profile' as never)}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="car-outline"
            label={t('account.vehicle')}
            onPress={() => router.push('/settings/vehicle' as never)}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="document-text-outline"
            label={t('account.documents')}
            onPress={() => router.push('/settings/documents' as never)}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="cash-outline"
            label={t('account.earnings')}
            onPress={() => router.push('/settings/earnings' as never)}
          />
        </Section>

        {/* Preferences */}
        <Section title={t('account.preferences')}>
          <MenuItem
            icon="language-outline"
            label={t('account.language')}
            onPress={() => router.push('/settings/language' as never)}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="color-palette-outline"
            label={t('account.appearance')}
            onPress={() => router.push('/settings/appearance' as never)}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="notifications-outline"
            label={t('account.notifications')}
            onPress={() => router.push('/settings/notifications' as never)}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="shield-checkmark-outline"
            label={t('account.security')}
            onPress={() => router.push('/settings/security' as never)}
          />
        </Section>

        {/* Support */}
        <Section>
          <MenuItem
            icon="help-circle-outline"
            label={t('account.support')}
            onPress={() => router.push('/settings/support' as never)}
          />
          <Divider theme={theme} />
          <MenuItem
            icon="information-circle-outline"
            label={t('account.about')}
            onPress={() => router.push('/settings/about' as never)}
          />
          <Divider theme={theme} />
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
  },
  headerText: { flex: 1, gap: Spacing.one },
  badgeWrap: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.four + 36 + Spacing.three,
  },
});