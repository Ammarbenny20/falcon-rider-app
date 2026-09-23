// src/components/ui/OTPInput.tsx

import { useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';

import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

type OTPInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  error?: boolean;
};

/**
 * Multi-box OTP input.
 *
 * Behavior:
 *   - Auto-advances focus as the user types.
 *   - Backspace on an empty box moves focus back.
 *   - Pasting a full code fills all boxes.
 *   - Only digits are accepted.
 */
export function OTPInput({
  value,
  onChange,
  length = 6,
  autoFocus = true,
  error = false,
}: OTPInputProps) {
  const theme = useTheme();
  const refs = useRef<Array<TextInput | null>>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const handleChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, '');
    if (!cleaned) {
      const next = value.slice(0, index) + value.slice(index + 1);
      onChange(next);
      return;
    }

    // Handle paste of the full code.
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, length - index);
      const next = (value.slice(0, index) + pasted).slice(0, length);
      onChange(next);
      const focusIndex = Math.min(index + pasted.length, length - 1);
      refs.current[focusIndex]?.focus();
      return;
    }

    const next = (value.slice(0, index) + cleaned + value.slice(index + 1)).slice(
      0,
      length,
    );
    onChange(next);

    if (index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            refs.current[index] = ref;
          }}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={autoFocus && index === 0}
          textAlign="center"
          style={[
            styles.box,
            {
              borderColor: error ? theme.danger : theme.border,
              color: theme.text,
              backgroundColor: theme.background,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two },
  box: {
    flex: 1,
    minHeight: 56,
    borderWidth: 1,
    borderRadius: Radii.sm,
    fontSize: 22,
    fontWeight: '600',
  },
});