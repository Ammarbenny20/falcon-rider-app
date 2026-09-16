import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminOverviewScreen from "../screens/admin/OverviewScreen";
import AdminProvidersScreen from "../screens/admin/ProvidersScreen";
import AdminJourneysScreen from "../screens/admin/JourneysScreen";
import AdminAccountScreen from "../screens/admin/AccountScreen";
import { COLORS } from "../constants/config";

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.mutedText,
      }}
    >
      <Tab.Screen name="Overview" component={AdminOverviewScreen} />
      <Tab.Screen name="Providers" component={AdminProvidersScreen} />
      <Tab.Screen name="Journeys" component={AdminJourneysScreen} />
      <Tab.Screen name="Account" component={AdminAccountScreen} />
    </Tab.Navigator>
  );
  # add import
import LiveOperationsScreen from "../screens/admin/LiveOperationsScreen";

# add inside <Tab.Navigator>, after Journeys tab:
<Tab.Screen name="Live Ops" component={LiveOperationsScreen} />
}