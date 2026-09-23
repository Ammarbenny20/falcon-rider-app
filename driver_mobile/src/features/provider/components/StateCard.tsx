// src/features/provider/components/StateCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import type { HomePrimaryAction } from '@/features/provider/hooks/useProviderStatus';
import { useTheme } from '@/hooks/use-theme';

type StateCardProps = {
  primaryAction: HomePrimaryAction;
  label: string;
  onAction: (action: HomePrimaryAction) => void;
};

export function StateCard({ primaryAction, label, onAction }: StateCardProps) {
  const theme = useTheme();

  const iconFor: Record<HomePrimaryAction['type'], keyof typeof Ionicons.glyphMap> = {
    onboard: 'construct-outline',
    pending_verification: 'time-outline',
    go_online: 'moon-outline',
    go_offline: 'checkmark-circle-outline',
    share_journey: 'add-circle-outline',
    view_journey: 'map-outline',
    review_match: 'people-outline',
    view_trip: 'navigate-outline',
  };

  const buttonLabelFor: Record<HomePrimaryAction['type'], string | null> = {
    onboard: 'Start',
    pending_verification: null,
    go_online: 'Go online',
    go_offline: 'Go offline',
    share_journey: 'Share journey',
    view_journey: 'View journey',
    review_match: 'Review',
    view_trip: 'View trip',
  };

  const buttonLabel = buttonLabelFor[primaryAction.type];

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.backgroundSelected },
          ]}
        >
          <Ionicons
            name={iconFor[primaryAction.type]}
            size={28}
            color={theme.primary}
          />
        </View>
        <View style={styles.textCol}>
          <ThemedText type="title3">{label}</ThemedText>
        </View>
      </View>

      {buttonLabel ? (
        <Button
          label={buttonLabel}
          size="lg"
          onPress={() => onAction(primaryAction)}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.four },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 2 },
});