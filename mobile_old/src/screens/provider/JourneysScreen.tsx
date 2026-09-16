import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { journeyApi } from "../../api/journeyApi";
import type { Journey } from "../../types";
import { COLORS } from "../../constants/config";

export default function ProviderJourneysScreen() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    journeyApi.list()
      .then((res) => setJourneys(res.results))
      .catch((e) => setError(e.detail ?? "Could not load journeys."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={styles.container}><ActivityIndicator color={COLORS.green} /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Journeys</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={journeys}
        keyExtractor={(j) => j.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.destination_label}</Text>
            <Text style={styles.rowSub}>{item.status.replace(/_/g, " ")} · {new Date(item.requested_at).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No journeys yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 16 },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowTitle: { fontSize: 15, fontWeight: "600", color: COLORS.charcoal },
  rowSub: { fontSize: 12, color: COLORS.mutedText, marginTop: 2 },
  empty: { color: COLORS.mutedText, textAlign: "center", marginTop: 40 },
  error: { color: COLORS.error, marginBottom: 12 },
});