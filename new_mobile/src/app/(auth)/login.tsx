// src/app/(auth)/login.tsx

import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useBiometric } from '@/features/auth/biometric/useBiometric';
import { useLogin } from '@/features/auth/hooks/useLogin';
import type { LoginFormValues } from '@/features/auth/schemas/auth.schema';

export default function LoginScreen() {
  const router = useRouter();
  const login = useLogin();
  const { isAvailable } = useBiometric();

  const handleSubmit = async (values: LoginFormValues) => {
    const { shouldOfferBiometric } = await login.mutateAsync({
      identifier: values.identifier.trim(),
      password: values.password,
    });

    if (shouldOfferBiometric && isAvailable) {
      router.replace('/(auth)/biometric-setup');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <Screen style={styles.content}>
      <AuthHeader title="Welcome back" subtitle="Log in to continue" />

      <LoginForm onSubmit={handleSubmit} isSubmitting={login.isPending} />

      <Button
        label="Forgot password?"
        variant="ghost"
        onPress={() => router.push('/(auth)/forgot-password')}
      />

      <Button
        label="Create account"
        variant="ghost"
        onPress={() => router.push('/(auth)/signup')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.five },
});