// mobile/src/screens/passenger/AccountScreen.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../constants/config";

const MENU_ITEMS = ["Profile", "Trusted contacts", "Payment methods", "Notifications", "Support", "Settings"];

export default function AccountScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.full_name || user?.phone_number}</Text>
      {MENU_ITEMS.map((item) => (
        <View key={item} style={styles.menuRow}>
          <Text style={styles.menuText}>{item}</Text>
        </View>
      ))}
      <Pressable style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  name: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 24 },
  menuRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuText: { fontSize: 15, color: COLORS.charcoal },
  logoutButton: { marginTop: 24, padding: 16, alignItems: "center" },
  logoutText: { color: COLORS.error, fontWeight: "700" },
});