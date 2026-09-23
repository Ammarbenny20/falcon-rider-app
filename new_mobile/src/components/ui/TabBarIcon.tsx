// src/components/ui/TabBarIcon.tsx

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/use-theme';

type IconName = keyof typeof Ionicons.glyphMap;

type TabBarIconProps = {
  /** Icon name in active state (e.g., "home") */
  activeName: IconName;
  /** Icon name in inactive state (e.g., "home-outline") */
  inactiveName: IconName;
  focused: boolean;
  size?: number;
};

export function TabBarIcon({
  activeName,
  inactiveName,
  focused,
  size = 24,
}: TabBarIconProps) {
  const theme = useTheme();

  return (
    <Ionicons
      name={focused ? activeName : inactiveName}
      size={size}
      color={focused ? theme.primary : theme.textSecondary}
    />
  );
}