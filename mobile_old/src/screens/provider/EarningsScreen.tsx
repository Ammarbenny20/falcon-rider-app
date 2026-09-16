import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { apiRequest } from "../../api/client";
import type { Payment, Paginated } from "../../types";
import { COLORS } from "../../constants/config";

export default function EarningsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<Paginated<Payment>>("/payments/")
      .then((res) => setPayments(res.results))
      .catch((e) => setError(e.detail ?? "Could not load earnings."))
      .finally(() => setLoading(false));
  }, []);

  const todayTotal = payments
    .filter((p) => new Date(p.created_at).toDateString() === new Date().toDateString() && p.status === "SUCCESSFUL")
    .reduce((sum, p) => sum + Number(p.provider_earning_amount), 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={COLORS.green} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today</Text>
      <Text style={styles.todayTotal}>TZS {todayTotal.toLocaleString()}</Text>

      <Text style={styles.subheading}>History</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={payments}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            <Text style={styles.rowAmount}>TZS {Number(item.provider_earning_amount).toLocaleString()}</Text>
            <Text style={styles.rowStatus}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No completed journeys yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 14, color: COLORS.mutedText },
  todayTotal: { fontSize: 32, fontWeight: "700", color: COLORS.darkGreen, marginBottom: 24 },
  subheading: { fontSize: 14, fontWeight: "700", color: COLORS.charcoal, marginBottom: 12 },
  row: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowDate: { color: COLORS.mutedText, fontSize: 13 },
  rowAmount: { color: COLORS.charcoal, fontSize: 13, fontWeight: "600" },
  rowStatus: { color: COLORS.green, fontSize: 12 },
  empty: { color: COLORS.mutedText, textAlign: "center", marginTop: 40 },
  error: { color: COLORS.error, marginBottom: 12 },
});