// src/features/provider/components/CapabilityTabs.tsx

import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Radii } from '@/constants/radii';
import { Spacing } from '@/constants/spacing';
import type { ProviderCapability } from '@/features/provider/types/provider.types';
import { useTheme } from '@/hooks/use-theme';

type CapabilityTabsProps = {
  capabilities: ProviderCapability[];
  active: ProviderCapability;
  onChange: (capability: ProviderCapability) => void;
};

/**
 * Segmented control for switching between provider capabilities
 * (Professional vs Community) when a provider has BOTH.
 *
 * If provider has only one capability, this component should NOT be
 * rendered — the Home screen will show the single capability directly.
 */
export function CapabilityTabs({
  capabilities,
  active,
  onChange,
}: CapabilityTabsProps) {
  const theme = useTheme();

  if (capabilities.length <= 1) return null;

  const labelFor: Record<ProviderCapability, string> = {
    PROFESSIONAL_SERVICE: 'Professional',
    COMMUNITY_JOURNEY: 'Community',
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundElement },
      ]}
    >
      {capabilities.map((cap) => {
        const isActive = cap === active;
        return (
          <Pressable
            key={cap}
            onPress={() => onChange(cap)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={[
              styles.segment,
              isActive && {
                backgroundColor: theme.background,
                ...styles.activeShadow,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{
                color: isActive ? theme.primary : theme.textSecondary,
              }}
            >
              {labelFor[cap]}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Radii.md,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.sm,
  },
  activeShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});