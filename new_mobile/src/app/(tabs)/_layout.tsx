// src/app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { TabBarIcon } from '@/components/ui/TabBarIcon';
import { Spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: Spacing.two,
          paddingBottom: Platform.OS === 'ios' ? Spacing.five : Spacing.two,
          paddingHorizontal: Spacing.two,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              activeName="home"
              inactiveName="home-outline"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="journeys"
        options={{
          title: 'Journeys',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              activeName="list"
              inactiveName="list-outline"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              activeName="person"
              inactiveName="person-outline"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}