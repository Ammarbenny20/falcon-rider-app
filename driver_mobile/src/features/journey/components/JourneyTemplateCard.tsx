// src/features/journey/components/JourneyTemplateCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import {
  DAY_LABELS,
  type JourneyTemplate,
} from '@/features/journey/types/journeyTemplate.types';
import { useTheme } from '@/hooks/use-theme';

type JourneyTemplateCardProps = {
  template: JourneyTemplate;
  onPress?: () => void;
};

export function JourneyTemplateCard({
  template,
  onPress,
}: JourneyTemplateCardProps) {
  const theme = useTheme();

  const daysLabel = template.days_of_week
    .map((d) => DAY_LABELS[d])
    .join(' · ');

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <ThemedText type="bodyBold">{template.name}</ThemedText>
          <Badge
            label={template.is_active ? 'Active' : 'Paused'}
            tone={template.is_active ? 'success' : 'neutral'}
          />
        </View>

        <View style={styles.route}>
          <View style={styles.routeRow}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <ThemedText type="body" numberOfLines={1} style={styles.flex}>
              {template.origin.label}
            </ThemedText>
          </View>
          <View
            style={[styles.connector, { backgroundColor: theme.border }]}
          />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={12} color={theme.danger} />
            <ThemedText type="body" numberOfLines={1} style={styles.flex}>
              {template.destination.label}
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText type="small" themeColor="textSecondary">
            {daysLabel}
          </ThemedText>
          <ThemedText type="smallBold">{template.departure_time}</ThemedText>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  route: { gap: Spacing.one },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  connector: { width: 1.5, height: 12, marginLeft: 4 },
  flex: { flex: 1 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});