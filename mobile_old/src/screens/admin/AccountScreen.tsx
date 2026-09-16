import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../constants/config";

export default function AdminAccountScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.full_name || user?.phone_number}</Text>
      <Text style={styles.role}>Admin</Text>
      <Pressable style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  name: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal },
  role: { fontSize: 13, color: COLORS.mutedText, marginTop: 4, marginBottom: 24 },
  logoutButton: { padding: 16, alignItems: "center" },
  logoutText: { color: COLORS.error, fontWeight: "700" },
});