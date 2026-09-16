import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { adminApi } from "../../api/adminApi";
import type { Journey, JourneyStatus } from "../../types";
import { COLORS } from "../../constants/config";

const FILTERS: (JourneyStatus | "ALL")[] = [
  "ALL", "SEARCHING", "MATCHING", "CONFIRMED", "PROVIDER_ARRIVING",
  "PROVIDER_ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED",
];

export default function AdminJourneysScreen() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [filter, setFilter] = useState<JourneyStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminApi.journeys(filter === "ALL" ? undefined : { status: filter })
      .then((res) => setJourneys(res.results))
      .catch((e) => setError(e.detail ?? "Could not load journeys."))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Journeys</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        keyExtractor={(f) => f}
        style={styles.filterRow}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.filterChip, filter === item && styles.filterChipActive]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item.replace(/_/g, " ")}
            </Text>
          </Pressable>
        )}
      />

      {loading && <ActivityIndicator color={COLORS.green} style={{ marginTop: 16 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={journeys}
        keyExtractor={(j) => j.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.origin_label} → {item.destination_label}</Text>
            <Text style={styles.rowSub}>
              {item.status.replace(/_/g, " ")} · {item.transport_type.replace(/_/g, " ")} · {item.payment_status}
            </Text>
            {item.fare_amount && <Text style={styles.rowFare}>TZS {Number(item.fare_amount).toLocaleString()}</Text>}
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No journeys match this filter.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 12 },
  filterRow: { marginBottom: 12, maxHeight: 40 },
  filterChip: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 14, marginRight: 8,
  },
  filterChipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  filterText: { fontSize: 12, color: COLORS.charcoal },
  filterTextActive: { color: COLORS.white, fontWeight: "700" },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowTitle: { fontSize: 14, fontWeight: "600", color: COLORS.charcoal },
  rowSub: { fontSize: 12, color: COLORS.mutedText, marginTop: 2 },
  rowFare: { fontSize: 12, color: COLORS.darkGreen, fontWeight: "700", marginTop: 2 },
  empty: { color: COLORS.mutedText, textAlign: "center", marginTop: 40 },
  error: { color: COLORS.error, marginTop: 8 },
});