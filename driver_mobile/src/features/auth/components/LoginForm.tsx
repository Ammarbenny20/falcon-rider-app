// src/features/auth/components/LoginForm.tsx

import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/spacing';
import { PasswordInput } from '@/features/auth/components/PasswordInput';

type LoginFormProps = {
  onSubmit: (values: { identifier: string; password: string }) => Promise<void>;
  isSubmitting: boolean;
};

export function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);

    if (!identifier.trim()) {
      setFormError('Enter your phone number or email');
      return;
    }
    if (!password) {
      setFormError('Enter your password');
      return;
    }

    try {
      await onSubmit({ identifier: identifier.trim(), password });
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : 'Something went wrong.',
      );
    }
  };

  return (
    <>
      <Input
        label="Phone or email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoFocus
        value={identifier}
        onChangeText={setIdentifier}
        editable={!isSubmitting}
        placeholder="+255700000000 or you@example.com"
      />

      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        editable={!isSubmitting}
      />

      {formError ? (
        <ThemedText themeColor="danger" type="small">
          {formError}
        </ThemedText>
      ) : null}

      <Button
        label="Log in"
        size="lg"
        onPress={handleSubmit}
        loading={isSubmitting}
      />
    </>
  );
}

export const loginFormStyles = StyleSheet.create({
  gap: { gap: Spacing.three },
});