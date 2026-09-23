// src/components/ui/Section.tsx

import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';

type SectionProps = {
  title?: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.container}>
      {title ? (
        <ThemedText type="smallBold" themeColor="textSecondary">
          {title}
        </ThemedText>
      ) : null}
      <Card style={styles.card}>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  card: { padding: 0, gap: 0 },
});