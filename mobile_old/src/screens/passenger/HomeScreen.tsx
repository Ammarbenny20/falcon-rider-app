import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PassengerStackParamList } from "../../navigation/PassengerNavigator";
import { COLORS } from "../../constants/config";

type Nav = NativeStackNavigationProp<PassengerStackParamList>;

export default function PassengerHomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Your journey. Your plan.</Text>

      <Pressable style={styles.searchBar} onPress={() => navigation.navigate("DestinationSearch")}>
        <Text style={styles.searchPrompt}>Where are you going?</Text>
      </Pressable>

      <View style={styles.quickRow}>
        <QuickAction label="Book a Bus" />
        <QuickAction label="Recent trips" />
        <QuickAction label="Saved places" />
      </View>
    </View>
  );
}

function QuickAction({ label }: { label: string }) {
  return (
    <View style={styles.quickAction}>
      <Text style={styles.quickActionText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  greeting: { fontSize: 14, color: COLORS.mutedText, marginBottom: 16 },
  searchBar: {
    backgroundColor: COLORS.softGreen, borderRadius: 20, padding: 20, marginBottom: 24,
  },
  searchPrompt: { fontSize: 18, fontWeight: "700", color: COLORS.charcoal },
  quickRow: { flexDirection: "row", gap: 10 },
  quickAction: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14,
    padding: 14, alignItems: "center",
  },
  quickActionText: { fontSize: 12, color: COLORS.charcoal, fontWeight: "600", textAlign: "center" },
});