import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProviderStackParamList } from "../../navigation/ProviderNavigator";
import { journeyApi } from "../../api/journeyApi";
import type { Journey, JourneyStatus } from "../../types";
import { COLORS } from "../../constants/config";

type Nav = NativeStackNavigationProp<ProviderStackParamList>;
type RouteProp = { params: { journeyId: string } };

const NEXT_ACTION: Partial<Record<JourneyStatus, { label: string; action: (id: string) => Promise<Journey> }>> = {
  CONFIRMED: { label: "I'VE ARRIVED", action: journeyApi.arrive },
  PROVIDER_ARRIVED: { label: "START JOURNEY", action: journeyApi.start },
  IN_PROGRESS: { label: "COMPLETE JOURNEY", action: journeyApi.complete },
};

export default function ActiveTripScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute() as RouteProp;
  const [journey, setJourney] = useState<Journey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    journeyApi.get(params.journeyId).then(setJourney).catch((e) =>
      setError(e.detail ?? "Could not load journey.")
    );
  }, [params.journeyId]);

  const advance = async () => {
    if (!journey) return;
    const step = NEXT_ACTION[journey.status];
    if (!step) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await step.action(journey.id);
      setJourney(updated);
      if (updated.status === "COMPLETED") {
        navigation.navigate("Tabs" as never);
      }
    } catch (e: any) {
      setError(e.detail ?? "Action failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!journey) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={COLORS.green} />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  const step = NEXT_ACTION[journey.status];

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{journey.status.replace(/_/g, " ")}</Text>
      <Text style={styles.destination}>{journey.destination_label}</Text>

      <View style={styles.card}>
        <Text style={styles.cardRow}>Pickup: {journey.origin_label}</Text>
        <Text style={styles.cardRow}>Destination: {journey.destination_label}</Text>
        {journey.distance_meters != null && (
          <Text style={styles.cardRow}>Distance: {(journey.distance_meters / 1000).toFixed(1)} km</Text>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {step && (
        <Pressable style={styles.button} onPress={advance} disabled={submitting}>
          {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>{step.label}</Text>}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  status: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 4 },
  destination: { fontSize: 14, color: COLORS.mutedText, marginBottom: 20 },
  card: { backgroundColor: COLORS.softGreen, borderRadius: 18, padding: 18, marginBottom: 20 },
  cardRow: { fontSize: 13, color: COLORS.charcoal, marginBottom: 6 },
  error: { color: COLORS.error, marginBottom: 12 },
  button: { backgroundColor: COLORS.green, borderRadius: 14, padding: 16, alignItems: "center" },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
});