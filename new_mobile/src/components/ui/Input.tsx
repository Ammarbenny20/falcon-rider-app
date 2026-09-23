// src/components/ui/Input.tsx

import { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, style, editable = true, ...rest }, ref) => {
    const theme = useTheme();

    return (
      <View style={styles.wrapper}>
        {label ? (
          <ThemedText type="small" themeColor="textSecondary">
            {label}
          </ThemedText>
        ) : null}

        <TextInput
          ref={ref}
          placeholderTextColor={theme.textSecondary}
          editable={editable}
          style={[
            styles.input,
            {
              borderColor: error ? theme.danger : theme.border,
              color: theme.text,
              backgroundColor: theme.background,
            },
            style,
          ]}
          accessibilityLabel={label}
          {...rest}
        />

        {error ? (
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}
      </View>
    );
  },
);
Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.one },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
});