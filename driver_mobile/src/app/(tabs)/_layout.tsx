// src/app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { TabBarIcon } from '@/components/ui/TabBarIcon';
import { Spacing } from '@/constants/spacing';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();
  const t = useTranslation();

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
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
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
        name="demand"
        options={{
          title: 'Mahitaji',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              activeName="flame"
              inactiveName="flame-outline"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: t('tabs.activity'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              activeName="pulse"
              inactiveName="pulse-outline"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="journeys"
        options={{
          title: t('tabs.journeys'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              activeName="map"
              inactiveName="map-outline"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabs.account'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              activeName="person"
              inactiveName="person-outline"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen name="trips" options={{ href: null }} />
      <Tabs.Screen name="earnings" options={{ href: null }} />
    </Tabs>
  );
}
