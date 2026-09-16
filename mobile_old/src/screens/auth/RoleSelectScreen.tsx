import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/RootNavigator";
import { COLORS } from "../../constants/config";

type Props = NativeStackScreenProps<AuthStackParamList, "RoleSelect">;

const ROLES: { role: "PASSENGER" | "PROVIDER" | "ADMIN"; title: string; subtitle: string }[] = [
  { role: "PASSENGER", title: "Passenger", subtitle: "Find and plan your journey." },
  { role: "PROVIDER", title: "Service Provider", subtitle: "Earn by providing mobility services." },
  { role: "ADMIN", title: "Admin", subtitle: "Manage Falcon Rider operations." },
];

export default function RoleSelectScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.tagline}>Make Every Commute Better.</Text>
      <Text style={styles.heading}>Welcome to Falcon Rider</Text>
      <Text style={styles.sub}>Continue as</Text>

      {ROLES.map((r) => (
        <Pressable
          key={r.role}
          style={styles.card}
          onPress={() => navigation.navigate("PhoneLogin", { role: r.role })}
        >
          <Text style={styles.cardTitle}>{r.title}</Text>
          <Text style={styles.cardSubtitle}>{r.subtitle}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 24, justifyContent: "center" },
  tagline: { color: COLORS.green, fontWeight: "600", marginBottom: 8 },
  heading: { fontSize: 28, fontWeight: "700", color: COLORS.charcoal, marginBottom: 24 },
  sub: { fontSize: 14, color: COLORS.mutedText, marginBottom: 12 },
  card: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 18,
    padding: 18, marginBottom: 12, backgroundColor: COLORS.softGreen,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: COLORS.charcoal },
  cardSubtitle: { fontSize: 13, color: COLORS.mutedText, marginTop: 4 },
});