// src/app/(auth)/signup.tsx

import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { useRegister } from '@/features/auth/hooks/useRegister';
import type { SignupFormValues } from '@/features/auth/schemas/auth.schema';

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

  const handleSubmit = async (values: SignupFormValues) => {
    const identifier = parseIdentifier(values.identifier);

    await register.mutateAsync({
      full_name: values.full_name.trim(),
      ...identifier,
      password: values.password,
      password_confirm: values.password_confirm,
    });

    router.replace('/(auth)/biometric-setup');
  };

  return (
    <Screen style={styles.content}>
      <AuthHeader title="Create account" subtitle="Join Falcon Rider" />

      <SignupForm
        onSubmit={handleSubmit}
        isSubmitting={register.isPending}
      />

      <Button
        label="Already have an account? Log in"
        variant="ghost"
        onPress={() => router.replace('/(auth)/login')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.five },
});