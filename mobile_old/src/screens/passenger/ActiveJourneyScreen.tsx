import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { journeyApi } from "../../api/journeyApi";
import type { Journey, JourneyStatus } from "../../types";
import { COLORS } from "../../constants/config";

type RouteProp = { params: { journeyId: string } };

const STATUS_COPY: Record<JourneyStatus, string> = {
  SEARCHING: "Looking for a provider...",
  MATCHING: "Matching you with a provider...",
  CONFIRMED: "Provider confirmed. On the way.",
  PROVIDER_ARRIVING: "Your provider is arriving.",
  PROVIDER_ARRIVED: "Your provider has arrived.",
  IN_PROGRESS: "Journey in progress.",
  COMPLETED: "Journey completed.",
  CANCELLED: "Journey cancelled.",
};

const POLL_INTERVAL_MS = 4000;

export default function ActiveJourneyScreen() {
  const { params } = useRoute() as RouteProp;
  const [journey, setJourney] = useState<Journey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJourney = useCallback(async () => {
    try {
      const data = await journeyApi.get(params.journeyId);
      setJourney(data);
      setError(null);
    } catch (e: any) {
      setError(e.detail ?? "Connection lost. We'll retry when you're back online.");
    }
  }, [params.journeyId]);

  useEffect(() => {
    fetchJourney();
    const isTerminal = (s?: JourneyStatus) => s === "COMPLETED" || s === "CANCELLED";
    const interval = setInterval(() => {
      setJourney((current) => {
        if (isTerminal(current?.status)) {
          clearInterval(interval);
          return current;
        }
        fetchJourney();
        return current;
      });
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchJourney]);

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
      <Text style={styles.status}>{STATUS_COPY[journey.status]}</Text>
      <Text style={styles.destination}>{journey.destination_label}</Text>

      {journey.status !== "SEARCHING" && journey.status !== "MATCHING" && (
        <View style={styles.detailCard}>
          {journey.pickup_eta_seconds != null && (
            <Text style={styles.detailRow}>
              Pickup ETA: {Math.round(journey.pickup_eta_seconds / 60)} min
            </Text>
          )}
          {journey.estimated_arrival_at && (
            <Text style={styles.detailRow}>
              Estimated arrival: {new Date(journey.estimated_arrival_at).toLocaleTimeString([], {
                hour: "2-digit", minute: "2-digit",
              })}
            </Text>
          )}
          {journey.fare_amount && (
            <Text style={styles.detailRow}>Fare: TZS {Number(journey.fare_amount).toLocaleString()}</Text>
          )}
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 80, alignItems: "center" },
  status: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 8, textAlign: "center" },
  destination: { fontSize: 14, color: COLORS.mutedText, marginBottom: 24 },
  detailCard: {
    backgroundColor: COLORS.softGreen, borderRadius: 18, padding: 18, width: "100%",
  },
  detailRow: { fontSize: 14, color: COLORS.charcoal, marginBottom: 6 },
  error: { color: COLORS.error, marginTop: 16 },
});