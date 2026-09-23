// src/features/auth/components/LoginForm.tsx

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/spacing';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/auth.schema';

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : 'Something went wrong.',
      );
    }
  });

  return (
    <>
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
            editable={!isSubmitting}
            placeholder="+255700000000 or you@example.com"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <PasswordInput
            label="Password"
            value={field.value}
            onChangeText={field.onChange}
            error={formState.errors.password?.message}
            editable={!isSubmitting}
          />
        )}
      />

      {formError ? (
        <ThemedText themeColor="danger" type="small">
          {formError}
        </ThemedText>
      ) : null}

      <Button
        label="Log in"
        size="lg"
        onPress={submit}
        loading={isSubmitting}
      />
    </>
  );
}

export const loginFormStyles = StyleSheet.create({
  gap: { gap: Spacing.three },
});