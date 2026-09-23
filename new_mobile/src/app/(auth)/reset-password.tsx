// src/app/(auth)/reset-password.tsx

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { OTPInput } from '@/components/ui/OTPInput';
import { Spacing } from '@/constants/spacing';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrength } from '@/features/auth/components/PasswordStrength';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas/auth.schema';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { identifier } = useLocalSearchParams<{ identifier: string }>();
  const reset = useResetPassword();
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState, watch, setValue } =
    useForm<ResetPasswordFormValues>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        otp: '',
        new_password: '',
        new_password_confirm: '',
      },
    });

  const newPassword = watch('new_password');

  const submit = handleSubmit(async (values) => {
    if (!identifier) {
      setFormError('Missing account identifier. Please restart.');
      return;
    }
    setFormError(null);
    try {
      await reset.mutateAsync({
        identifier,
        otp: values.otp,
        new_password: values.new_password,
        new_password_confirm: values.new_password_confirm,
      });
      router.replace('/login');
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  });

  return (
    <Screen style={styles.content}>
      <AuthHeader
        title="Enter the code"
        subtitle={
          identifier
            ? `We sent a code to ${identifier}`
            : 'Enter the code we sent you'
        }
      />

      <Controller
        control={control}
        name="otp"
        render={({ field }) => (
          <OTPInput
            value={field.value}
            onChange={(v) => setValue('otp', v, { shouldValidate: true })}
            error={Boolean(formState.errors.otp)}
          />
        )}
      />

      <Controller
        control={control}
        name="new_password"
        render={({ field }) => (
          <>
            <PasswordInput
              label="New password"
              value={field.value}
              onChangeText={field.onChange}
              error={formState.errors.new_password?.message}
              editable={!reset.isPending}
            />
            <PasswordStrength password={newPassword} />
          </>
        )}
      />

      <Controller
        control={control}
        name="new_password_confirm"
        render={({ field }) => (
          <PasswordInput
            label="Confirm new password"
            value={field.value}
            onChangeText={field.onChange}
            error={formState.errors.new_password_confirm?.message}
            editable={!reset.isPending}
          />
        )}
      />

      {formError ? (
        <ThemedText themeColor="danger" type="small">
          {formError}
        </ThemedText>
      ) : null}

      <Button
        label="Reset password"
        size="lg"
        onPress={submit}
        loading={reset.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.five },
});