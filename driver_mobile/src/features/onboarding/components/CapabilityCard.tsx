// src/features/onboarding/components/CapabilityCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import type { ProviderCapability } from '@/features/provider/types/provider.types';
import { useTheme } from '@/hooks/use-theme';

type CapabilityCardProps = {
  capability: ProviderCapability;
  selected: boolean;
  onPress: () => void;
};

export function CapabilityCard({
  capability,
  selected,
  onPress,
}: CapabilityCardProps) {
  const theme = useTheme();

  const config: Record<
    ProviderCapability,
    {
      icon: keyof typeof Ionicons.glyphMap;
      title: string;
      description: string;
    }
  > = {
    PROFESSIONAL_SERVICE: {
      icon: 'car-outline',
      title: 'Provide rides professionally',
      description:
        'Offer transportation services and receive eligible ride requests.',
    },
    COMMUNITY_JOURNEY: {
      icon: 'people-outline',
      title: 'Share journeys I already make',
      description:
        "Share available seats on journeys you're already planning to take.",
    },
  };

  const { icon, title, description } = config[capability];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.card,
        {
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected
            ? theme.backgroundSelected
            : theme.backgroundElement,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: selected
              ? theme.background
              : theme.backgroundSelected,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={26}
          color={selected ? theme.primary : theme.textSecondary}
        />
      </View>

      <View style={styles.textCol}>
        <ThemedText type="bodyBold">{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>

      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={selected ? theme.primary : theme.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radii.md,
    borderWidth: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 2 },
});