import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProviderHomeScreen from "../screens/provider/HomeScreen";
import IncomingRequestScreen from "../screens/provider/IncomingRequestScreen";
import ActiveTripScreen from "../screens/provider/ActiveTripScreen";
import ProviderJourneysScreen from "../screens/provider/JourneysScreen";
import EarningsScreen from "../screens/provider/EarningsScreen";
import ProviderAccountScreen from "../screens/provider/AccountScreen";
import { COLORS } from "../constants/config";

export type ProviderStackParamList = {
  Tabs: undefined;
  IncomingRequest: { journeyId: string };
  ActiveTrip: { journeyId: string };
};

const Stack = createNativeStackNavigator<ProviderStackParamList>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.mutedText,
      }}
    >
      <Tab.Screen name="Home" component={ProviderHomeScreen} />
      <Tab.Screen name="Journeys" component={ProviderJourneysScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Account" component={ProviderAccountScreen} />
    </Tab.Navigator>
  );
}

export default function ProviderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="IncomingRequest" component={IncomingRequestScreen} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
    </Stack.Navigator>
  );
}