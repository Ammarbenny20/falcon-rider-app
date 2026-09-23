// src/features/provider/components/HomeHeader.tsx

import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Logo } from '@/components/ui/Logo';
import { Spacing } from '@/constants/spacing';

type HomeHeaderProps = {
  firstName: string;
};

export function HomeHeader({ firstName }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <Logo size="sm" variant="circle" />
      <ThemedText type="title2">Hi, {firstName}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
});