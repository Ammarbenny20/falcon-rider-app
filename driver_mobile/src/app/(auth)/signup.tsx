// src/app/(auth)/signup.tsx

import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Spacing } from '@/constants/spacing';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { useTranslation } from '@/i18n';

function parseIdentifier(identifier: string): {
  phone_number?: string;
  email?: string;
} {
  const v = identifier.trim();
  return v.includes('@') ? { email: v } : { phone_number: v };
}

export default function SignupScreen() {
  const router = useRouter();
  const register = useRegister();
  const t = useTranslation();

  const handleSubmit = async (values: {
    full_name: string;
    identifier: string;
    password: string;
    password_confirm: string;
  }) => {
    const identifier = parseIdentifier(values.identifier);

    await register.mutateAsync({
      full_name: values.full_name,
      ...identifier,
      password: values.password,
      password_confirm: values.password_confirm,
    });

    // After signup, take the provider to onboarding so they can
    // select capabilities (PROFESSIONAL_SERVICE, COMMUNITY_JOURNEY, or both).
    router.replace('/(auth)/onboarding');
  };

  return (
    <Screen style={styles.content}>
      <AuthHeader
        title={t('auth.signup.title')}
        subtitle={t('auth.signup.subtitle')}
      />

      <SignupForm onSubmit={handleSubmit} isSubmitting={register.isPending} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.five },
});