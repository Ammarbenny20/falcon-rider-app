import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProviderStackParamList } from "../../navigation/ProviderNavigator";
import { journeyApi } from "../../api/journeyApi";
import type { Journey } from "../../types";
import { COLORS } from "../../constants/config";

type Nav = NativeStackNavigationProp<ProviderStackParamList>;
type RouteProp = { params: { journeyId: string } };

export default function IncomingRequestScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute() as RouteProp;
  const [journey, setJourney] = useState<Journey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    journeyApi.get(params.journeyId).then(setJourney).catch((e) =>
      setError(e.detail ?? "Could not load request.")
    );
  }, [params.journeyId]);

  const accept = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Only server confirmation counts as "accepted" — spec section 63.
      await journeyApi.accept(params.journeyId);
      navigation.replace("ActiveTrip", { journeyId: params.journeyId });
    } catch (e: any) {
      // Someone else likely claimed it first (409 from row-locked accept_journey)
      setError(e.detail ?? "This request is no longer available.");
      setTimeout(() => navigation.navigate("Tabs" as never), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  const decline = () => navigation.navigate("Tabs" as never);

  if (!journey) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={COLORS.green} />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New journey request</Text>

      <View style={styles.card}>
        <Row label="Pickup" value={journey.origin_label} />
        <Row label="Destination" value={journey.destination_label} />
        <Row label="Transport" value={journey.transport_type.replace("_", " ")} />
        {journey.distance_meters != null && (
          <Row label="Distance" value={`${(journey.distance_meters / 1000).toFixed(1)} km`} />
        )}
        {journey.fare_amount != null && (
          <Row label="Estimated fare" value={`TZS ${Number(journey.fare_amount).toLocaleString()}`} />
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.actionsRow}>
        <Pressable style={[styles.button, styles.declineButton]} onPress={decline} disabled={submitting}>
          <Text style={styles.declineText}>Decline</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.acceptButton]} onPress={accept} disabled={submitting}>
          {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.acceptText}>Accept</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 16 },
  card: { backgroundColor: COLORS.softGreen, borderRadius: 18, padding: 18, marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  rowLabel: { color: COLORS.mutedText, fontSize: 13 },
  rowValue: { color: COLORS.charcoal, fontSize: 13, fontWeight: "600" },
  error: { color: COLORS.error, marginBottom: 12 },
  actionsRow: { flexDirection: "row", gap: 12 },
  button: { flex: 1, borderRadius: 14, padding: 16, alignItems: "center" },
  declineButton: { borderWidth: 1, borderColor: COLORS.border },
  declineText: { color: COLORS.charcoal, fontWeight: "700" },
  acceptButton: { backgroundColor: COLORS.green },
  acceptText: { color: COLORS.white, fontWeight: "700" },
});