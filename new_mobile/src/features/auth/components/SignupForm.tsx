// src/features/auth/components/SignupForm.tsx

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/spacing';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrength } from '@/features/auth/components/PasswordStrength';
import {
  signupSchema,
  type SignupFormValues,
} from '@/features/auth/schemas/auth.schema';

type SignupFormProps = {
  onSubmit: (values: SignupFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function SignupForm({ onSubmit, isSubmitting }: SignupFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit, formState, watch } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      identifier: '',
      password: '',
      password_confirm: '',
    },
  });

  const password = watch('password');

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
        name="full_name"
        render={({ field }) => (
          <Input
            label="Full name"
            autoCapitalize="words"
            autoFocus
            value={field.value}
            onChangeText={field.onChange}
            error={formState.errors.full_name?.message}
            editable={!isSubmitting}
          />
        )}
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
          <>
            <PasswordInput
              label="Password"
              value={field.value}
              onChangeText={field.onChange}
              error={formState.errors.password?.message}
              editable={!isSubmitting}
            />
            <PasswordStrength password={password} />
          </>
        )}
      />

      <Controller
        control={control}
        name="password_confirm"
        render={({ field }) => (
          <PasswordInput
            label="Confirm password"
            value={field.value}
            onChangeText={field.onChange}
            error={formState.errors.password_confirm?.message}
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
        label="Create account"
        size="lg"
        onPress={submit}
        loading={isSubmitting}
      />
    </>
  );
}

export const signupFormStyles = StyleSheet.create({
  gap: { gap: Spacing.three },
});