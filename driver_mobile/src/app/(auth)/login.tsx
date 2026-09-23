// src/app/(auth)/login.tsx

import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Spacing } from '@/constants/spacing';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useTranslation } from '@/i18n';

export default function LoginScreen() {
  const router = useRouter();
  const login = useLogin();
  const t = useTranslation();

  const handleSubmit = async (values: {
    identifier: string;
    password: string;
  }) => {
    await login.mutateAsync(values);
    router.replace('/(tabs)');
  };

  return (
    <Screen style={styles.content}>
      <AuthHeader
        title={t('auth.login.title')}
        subtitle={t('auth.login.subtitle')}
      />

      <LoginForm onSubmit={handleSubmit} isSubmitting={login.isPending} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.five },
});