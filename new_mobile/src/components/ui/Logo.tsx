// src/components/ui/Logo.tsx

import { Image, StyleSheet, View, type ViewStyle } from 'react-native';

import { Radii } from '@/constants/radii';
import { Shadows } from '@/constants/shadows';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type LogoProps = {
  size?: LogoSize;
  variant?: 'plain' | 'circle';
  style?: ViewStyle;
};

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 56,
  md: 88,
  lg: 128,
  xl: 160,
  '2xl': 200,
};

// Green that matches the logo's background
const LOGO_GREEN = '#0B4A2E';

export function Logo({
  size = 'md',
  variant = 'circle',
  style,
}: LogoProps) {
  const dimension = SIZE_MAP[size];
  const isCircle = variant === 'circle';

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: isCircle ? dimension / 2 : Radii.md,
          backgroundColor: LOGO_GREEN,
        },
        isCircle && Shadows.lg,
        style,
      ]}
    >
      <Image
        source={require('@/assets/images/logo.png')}
        style={{
          width: dimension * 0.75,
          height: dimension * 0.75,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});