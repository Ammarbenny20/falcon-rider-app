// src/features/auth/components/SignupForm.tsx

import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/spacing';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { PasswordStrength } from '@/features/auth/components/PasswordStrength';

type SignupFormValues = {
  full_name: string;
  identifier: string;
  password: string;
  password_confirm: string;
};

type SignupFormProps = {
  onSubmit: (values: SignupFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function SignupForm({ onSubmit, isSubmitting }: SignupFormProps) {
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);

    if (fullName.trim().length < 2) {
      setFormError('Enter your full name');
      return;
    }
    if (!identifier.trim()) {
      setFormError('Enter your phone number or email');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    if (password !== passwordConfirm) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await onSubmit({
        full_name: fullName.trim(),
        identifier: identifier.trim(),
        password,
        password_confirm: passwordConfirm,
      });
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : 'Something went wrong.',
      );
    }
  };

  return (
    <>
      <Input
        label="Full name"
        autoCapitalize="words"
        autoFocus
        value={fullName}
        onChangeText={setFullName}
        editable={!isSubmitting}
      />

      <Input
        label="Phone or email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
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
      <PasswordStrength password={password} />

      <PasswordInput
        label="Confirm password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        editable={!isSubmitting}
      />

      {formError ? (
        <ThemedText themeColor="danger" type="small">
          {formError}
        </ThemedText>
      ) : null}

      <Button
        label="Create account"
        size="lg"
        onPress={handleSubmit}
        loading={isSubmitting}
      />
    </>
  );
}

export const signupFormStyles = StyleSheet.create({
  gap: { gap: Spacing.three },
});