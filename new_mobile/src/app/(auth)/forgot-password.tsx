// src/app/(auth)/forgot-password.tsx

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/spacing';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/auth.schema';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const forgot = useForgotPassword();
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState } =
    useForm<ForgotPasswordFormValues>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { identifier: '' },
    });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await forgot.mutateAsync({ identifier: values.identifier.trim() });
      router.push({
        pathname: '/reset-password',
        params: { identifier: values.identifier.trim() },
      });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  });

  return (
    <Screen style={styles.content}>
      <AuthHeader
        title="Reset password"
        subtitle="We'll send you a 6-digit code"
      />

      <Controller
        control={control}
        name="identifier"
        render={({ field }) => (
          <Input
            label="Phone or email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoFocus
            value={field.value}
            onChangeText={field.onChange}
            error={formState.errors.identifier?.message}
            editable={!forgot.isPending}
          />
        )}
      />

      {formError ? (
        <ThemedText themeColor="danger" type="small">
          {formError}
        </ThemedText>
      ) : null}

      <Button
        label="Send code"
        size="lg"
        onPress={submit}
        loading={forgot.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.five },
});