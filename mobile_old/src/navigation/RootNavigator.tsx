import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";
import RoleSelectScreen from "../screens/auth/RoleSelectScreen";
import PhoneLoginScreen from "../screens/auth/PhoneLoginScreen";
import OtpVerifyScreen from "../screens/auth/OtpVerifyScreen";
import PassengerNavigator from "./PassengerNavigator";
import ProviderNavigator from "./ProviderNavigator";
import AdminNavigator from "./AdminNavigator";

export type AuthStackParamList = {
  RoleSelect: undefined;
  PhoneLogin: { role: "PASSENGER" | "PROVIDER" | "ADMIN" };
  OtpVerify: { phone: string; role: "PASSENGER" | "PROVIDER" | "ADMIN" };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, user, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <NavigationContainer>
      {!isAuthenticated || !user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
          <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
          <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        </Stack.Navigator>
      ) : user.role === "PASSENGER" ? (
        <PassengerNavigator />
      ) : user.role === "PROVIDER" ? (
        <ProviderNavigator />
      ) : (
        <AdminNavigator />
      )}
    </NavigationContainer>
  );
}