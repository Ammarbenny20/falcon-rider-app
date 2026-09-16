import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { adminApi } from "../../api/adminApi";
import { COLORS } from "../../constants/config";

export default function AdminOverviewScreen() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminApi.overview>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.overview()
      .then(setData)
      .catch((e) => setError(e.detail ?? "Could not load overview."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading && !data) {
    return <View style={styles.container}><ActivityIndicator color={COLORS.green} /></View>;
  }
  if (error && !data) {
    return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
  }
  if (!data) return null;

  const stats = [
    ["Total users", data.total_users],
    ["Active commuters", data.active_commuters],
    ["Registered providers", data.registered_providers],
    ["Verified providers", data.verified_providers],
    ["Providers online", data.providers_online],
    ["Active journeys", data.active_journeys],
    ["Completed journeys", data.completed_journeys],
    ["Today's journeys", data.todays_journeys],
    ["Today's revenue (TZS)", data.todays_revenue.toLocaleString()],
  ] as const;

  const alerts = [
    ["Providers awaiting verification", data.alerts.providers_awaiting_verification],
    ["Vehicles awaiting verification", data.alerts.vehicles_awaiting_verification],
    ["Safety incidents", data.alerts.safety_incidents],
    ["Failed payments", data.alerts.failed_payments],
    ["Cancelled journeys", data.alerts.cancelled_journeys],
    ["Open support tickets", data.alerts.open_support_tickets],
    ["Bus bookings needing action", data.alerts.bus_bookings_needing_action],
  ] as const;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={COLORS.green} />}
    >
      <Text style={styles.heading}>Overview</Text>

      <View style={styles.grid}>
        {stats.map(([label, value]) => (
          <View key={label} style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subheading}>Needs attention</Text>
      {alerts.map(([label, value]) => value > 0 && (
        <View key={label} style={styles.alertRow}>
          <Text style={styles.alertLabel}>{label}</Text>
          <Text style={styles.alertValue}>{value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 22, fontWeight: "700", color: COLORS.charcoal, marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  statCard: {
    width: "47%", backgroundColor: COLORS.softGreen, borderRadius: 16, padding: 14,
  },
  statValue: { fontSize: 22, fontWeight: "700", color: COLORS.darkGreen },
  statLabel: { fontSize: 12, color: COLORS.mutedText, marginTop: 4 },
  subheading: { fontSize: 15, fontWeight: "700", color: COLORS.charcoal, marginBottom: 10 },
  alertRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  alertLabel: { color: COLORS.charcoal, fontSize: 13 },
  alertValue: { color: COLORS.error, fontWeight: "700" },
  error: { color: COLORS.error },
});