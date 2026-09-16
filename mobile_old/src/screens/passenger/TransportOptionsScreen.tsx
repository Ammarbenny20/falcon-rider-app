import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PassengerStackParamList } from "../../navigation/PassengerNavigator";
import { useJourneyStore } from "../../store/journeyStore";
import { COLORS } from "../../constants/config";
import type { TransportOption } from "../../types";

type Nav = NativeStackNavigationProp<PassengerStackParamList>;

const LABELS: Record<string, string> = {
  BODA_BODA: "Boda Boda",
  BAJAJI: "Bajaji",
  CAR: "Car",
  BUS: "Bus",
};

function formatMinutes(seconds: number) {
  return `${Math.round(seconds / 60)} min`;
}

function formatRange(minSec: number, maxSec: number) {
  return `${Math.round(minSec / 60)}–${Math.round(maxSec / 60)} min`;
}

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString()}`;
}

function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function TransportOptionsScreen() {
  const navigation = useNavigation<Nav>();
  const options = useJourneyStore((s) => s.transportOptions);

  if (options.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No transport currently available for this route.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose how you'll travel</Text>
      <FlatList
        data={options}
        keyExtractor={(item) => item.transport_type}
        renderItem={({ item }: { item: TransportOption }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("ConfirmJourney", { transportType: item.transport_type })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{LABELS[item.transport_type]}</Text>
              <Text style={styles.fare}>{formatTZS(item.fare_amount)}</Text>
            </View>
            <Text style={styles.detail}>Pickup: {formatMinutes(item.pickup_eta_seconds)}</Text>
            <Text style={styles.detail}>
              Travel: {formatRange(item.travel_time_min_seconds, item.travel_time_max_seconds)}
            </Text>
            <Text style={styles.detail}>
              Estimated arrival: {formatClock(item.estimated_arrival_at)}
            </Text>
            <Text
              style={[
                styles.availability,
                item.availability === "FULL" || item.availability === "NEARLY_FULL"
                  ? styles.availabilityWarn
                  : styles.availabilityOk,
              ]}
            >
              {item.seats_remaining != null
                ? `${item.seats_remaining} / ${item.seats_total} seats left`
                : item.availability.replace("_", " ")}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 16 },
  empty: { color: COLORS.mutedText, marginTop: 40, textAlign: "center" },
  card: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 18,
    padding: 18, marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.charcoal },
  fare: { fontSize: 16, fontWeight: "700", color: COLORS.darkGreen },
  detail: { fontSize: 13, color: COLORS.mutedText, marginTop: 2 },
  availability: { fontSize: 12, fontWeight: "600", marginTop: 8 },
  availabilityOk: { color: COLORS.green },
  availabilityWarn: { color: COLORS.error },
});