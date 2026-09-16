import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PassengerHomeScreen from "../screens/passenger/HomeScreen";
import DestinationSearchScreen from "../screens/passenger/DestinationSearchScreen";
import NowPlanScreen from "../screens/passenger/NowPlanScreen";
import TransportOptionsScreen from "../screens/passenger/TransportOptionsScreen";
import ConfirmJourneyScreen from "../screens/passenger/ConfirmJourneyScreen";
import ActiveJourneyScreen from "../screens/passenger/ActiveJourneyScreen";
import JourneysListScreen from "../screens/passenger/JourneysListScreen";
import AccountScreen from "../screens/passenger/AccountScreen";
import { COLORS } from "../constants/config";

export type PassengerStackParamList = {
  Tabs: undefined;
  DestinationSearch: undefined;
  NowPlan: undefined;
  TransportOptions: undefined;
  ConfirmJourney: { transportType: string };
  ActiveJourney: { journeyId: string };
};

const Stack = createNativeStackNavigator<PassengerStackParamList>();
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
      <Tab.Screen name="Home" component={PassengerHomeScreen} />
      <Tab.Screen name="Journeys" component={JourneysListScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function PassengerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="DestinationSearch" component={DestinationSearchScreen} />
      <Stack.Screen name="NowPlan" component={NowPlanScreen} />
      <Stack.Screen name="TransportOptions" component={TransportOptionsScreen} />
      <Stack.Screen name="ConfirmJourney" component={ConfirmJourneyScreen} />
      <Stack.Screen name="ActiveJourney" component={ActiveJourneyScreen} />
    </Stack.Navigator>
  );
}