// src/features/auth/components/PasswordInput.tsx

import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry'> & {
  label?: string;
  error?: string;
};

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ label, error, style, editable = true, ...rest }, ref) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);

    return (
      <View style={styles.wrapper}>
        {label ? (
          <ThemedText type="small" themeColor="textSecondary">
            {label}
          </ThemedText>
        ) : null}

        <View
          style={[
            styles.inputRow,
            {
              borderColor: error ? theme.danger : theme.border,
              backgroundColor: theme.background,
            },
          ]}
        >
          <TextInput
            ref={ref}
            secureTextEntry={!visible}
            placeholderTextColor={theme.textSecondary}
            editable={editable}
            style={[styles.input, { color: theme.text }, style]}
            accessibilityLabel={label}
            {...rest}
          />

          <Pressable
            onPress={() => setVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            hitSlop={8}
            style={styles.toggle}
          >
            <ThemedText type="small" style={{ color: theme.primary }}>
              {visible ? 'Hide' : 'Show'}
            </ThemedText>
          </Pressable>
        </View>

        {error ? (
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}
      </View>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.one },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.three,
  },
  toggle: {
    paddingLeft: Spacing.two,
    minHeight: 44,
    justifyContent: 'center',
  },
});