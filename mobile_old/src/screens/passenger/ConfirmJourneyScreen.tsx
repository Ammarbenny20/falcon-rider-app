import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PassengerStackParamList } from "../../navigation/PassengerNavigator";
import { useJourneyStore } from "../../store/journeyStore";
import { journeyApi } from "../../api/journeyApi";
import { COLORS } from "../../constants/config";
import type { TransportType } from "../../types";

type Nav = NativeStackNavigationProp<PassengerStackParamList>;
type RouteProp = { params: { transportType: TransportType } };

export default function ConfirmJourneyScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute() as RouteProp;
  const { draft, transportOptions, setActiveJourney, resetDraft } = useJourneyStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const option = transportOptions.find((o) => o.transport_type === params.transportType);

  const confirm = async () => {
    if (!draft.origin || !draft.destination) return;
    setSubmitting(true);
    setError(null);
    try {
      const journey = await journeyApi.create({
        transport_type: params.transportType,
        origin_lat: draft.origin.lat,
        origin_lng: draft.origin.lng,
        origin_label: draft.origin.label,
        destination_lat: draft.destination.lat,
        destination_lng: draft.destination.lng,
        destination_label: draft.destination.label,
        is_scheduled: draft.mode === "PLAN",
        scheduled_for: draft.scheduledFor ?? undefined,
      });
      setActiveJourney(journey);
      resetDraft();
      navigation.replace("ActiveJourney", { journeyId: journey.id });
    } catch (e: any) {
      setError(e.detail ?? "Could not confirm journey. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Confirm your journey</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryRow}>From: {draft.origin?.label}</Text>
        <Text style={styles.summaryRow}>To: {draft.destination?.label}</Text>
        <Text style={styles.summaryRow}>Transport: {params.transportType.replace("_", " ")}</Text>
        {option && (
          <Text style={styles.fare}>TZS {option.fare_amount.toLocaleString()}</Text>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={confirm} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Confirm journey</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 20 },
  summaryCard: {
    backgroundColor: COLORS.softGreen, borderRadius: 18, padding: 18, marginBottom: 20,
  },
  summaryRow: { fontSize: 14, color: COLORS.charcoal, marginBottom: 6 },
  fare: { fontSize: 18, fontWeight: "700", color: COLORS.darkGreen, marginTop: 8 },
  error: { color: COLORS.error, marginBottom: 12 },
  button: { backgroundColor: COLORS.green, borderRadius: 14, padding: 16, alignItems: "center" },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
});