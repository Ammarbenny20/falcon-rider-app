import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { apiRequest } from "../../api/client";
import { COLORS } from "../../constants/config";

interface LiveJourney {
  journey_id: string;
  passenger_name: string;
  vehicle_plate: string | null;
  origin_label: string;
  destination_label: string;
  status: string;
  payment_status: string;
  provider_position: { lat: number | null; lng: number | null; is_simulated: boolean } | null;
}

const POLL_INTERVAL_MS = 6000;

export default function LiveOperationsScreen() {
  const [journeys, setJourneys] = useState<LiveJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    apiRequest<LiveJourney[]>("/admin/live-operations/")
      .then((res) => { setJourneys(res); setError(null); })
      .catch((e) => setError(e.detail ?? "Connection lost."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) return <View style={styles.container}><ActivityIndicator color={COLORS.green} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Live Operations</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={journeys}
        keyExtractor={(j) => j.journey_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.origin_label} → {item.destination_label}</Text>
            <Text style={styles.cardSub}>{item.passenger_name} · {item.status.replace(/_/g, " ")}</Text>
            {item.provider_position?.lat != null && (
              <Text style={styles.positionLabel}>
                {item.provider_position.is_simulated ? "Estimated provider position" : "Live provider position"}
                {": "}
                {item.provider_position.lat.toFixed(4)}, {item.provider_position.lng!.toFixed(4)}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No active journeys right now.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 16 },
  card: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 14, marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: COLORS.charcoal },
  cardSub: { fontSize: 12, color: COLORS.mutedText, marginTop: 2 },
  positionLabel: { fontSize: 11, color: COLORS.mutedText, marginTop: 6, fontStyle: "italic" },
  empty: { color: COLORS.mutedText, textAlign: "center", marginTop: 40 },
  error: { color: COLORS.error, marginBottom: 12 },
});