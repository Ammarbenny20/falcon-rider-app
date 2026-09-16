import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { apiRequest } from "../../api/client";
import type { BusBooking, Paginated } from "../../types";
import { COLORS } from "../../constants/config";

const NEXT_STATUS: Record<string, string> = {
  REQUESTED: "REVIEWING",
  REVIEWING: "BUS_ASSIGNED",
  BUS_ASSIGNED: "CONFIRMED",
  CONFIRMED: "READY_FOR_DEPARTURE",
  READY_FOR_DEPARTURE: "VEHICLE_ARRIVING",
  VEHICLE_ARRIVING: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
};

export default function AdminBusBookingsScreen() {
  const [bookings, setBookings] = useState<BusBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    apiRequest<Paginated<BusBooking>>("/bus-bookings/")
      .then((res) => setBookings(res.results))
      .catch((e) => setError(e.detail ?? "Could not load bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const advance = async (booking: BusBooking) => {
    const next = NEXT_STATUS[booking.status];
    if (!next) return;
    try {
      await apiRequest(`/bus-bookings/${booking.id}/set_status/`, { method: "POST", body: { status: next } });
      load();
    } catch (e: any) {
      setError(e.detail ?? "Could not update status.");
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator color={COLORS.green} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bus Bookings</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.pickup_label} → {item.destination_label}</Text>
            <Text style={styles.cardSub}>
              {item.travel_date} · {item.passenger_count} passengers · {item.status.replace(/_/g, " ")}
            </Text>
            {NEXT_STATUS[item.status] && (
              <Pressable style={styles.advanceBtn} onPress={() => advance(item)}>
                <Text style={styles.advanceText}>
                  Move to {NEXT_STATUS[item.status].replace(/_/g, " ")}
                </Text>
              </Pressable>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No bus bookings.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 16 },
  card: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: COLORS.charcoal },
  cardSub: { fontSize: 12, color: COLORS.mutedText, marginTop: 4, marginBottom: 10 },
  advanceBtn: { backgroundColor: COLORS.green, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  advanceText: { color: COLORS.white, fontWeight: "700", fontSize: 12 },
  empty: { color: COLORS.mutedText, textAlign: "center", marginTop: 40 },
  error: { color: COLORS.error, marginBottom: 12 },
});