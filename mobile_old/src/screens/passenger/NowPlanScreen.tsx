import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PassengerStackParamList } from "../../navigation/PassengerNavigator";
import { useJourneyStore } from "../../store/journeyStore";
import { routeApi } from "../../api/routeApi";
import { COLORS } from "../../constants/config";

type Nav = NativeStackNavigationProp<PassengerStackParamList>;

// Placeholder — replace with device geolocation at integration time.
const CURRENT_LOCATION = { lat: -6.7924, lng: 39.2083, label: "Current location" };

export default function NowPlanScreen() {
  const navigation = useNavigation<Nav>();
  const { draft, setOrigin, setMode, setTransportOptions } = useJourneyStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proceedNow = async () => {
    if (!draft.destination) return;
    setOrigin(CURRENT_LOCATION);
    setMode("NOW");
    setLoading(true);
    setError(null);
    try {
      const route = await routeApi.calculate(CURRENT_LOCATION, draft.destination);
      // Transport options per transport type are derived server-side in a
      // dedicated endpoint in the next phase — for now we carry the route
      // result forward so TransportOptionsScreen can request per-type fares.
      setTransportOptions([]);
      navigation.navigate("TransportOptions");
    } catch (e: any) {
      setError(e.detail ?? "Could not calculate route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{draft.destination?.label}</Text>

      <Pressable style={styles.optionCard} onPress={proceedNow} disabled={loading}>
        <Text style={styles.optionTitle}>NOW</Text>
        <Text style={styles.optionSub}>Leave right away</Text>
      </Pressable>

      <Pressable
        style={styles.optionCard}
        onPress={() => {
          setMode("PLAN");
          // PLAN detail screen (date/window picker) — next build step.
        }}
      >
        <Text style={styles.optionTitle}>PLAN</Text>
        <Text style={styles.optionSub}>Choose a date and departure window</Text>
      </Pressable>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} color={COLORS.green} />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 20 },
  optionCard: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 18,
    padding: 20, marginBottom: 14, backgroundColor: COLORS.softGreen,
  },
  optionTitle: { fontSize: 17, fontWeight: "700", color: COLORS.darkGreen },
  optionSub: { fontSize: 13, color: COLORS.mutedText, marginTop: 4 },
  error: { color: COLORS.error, marginTop: 8 },
});

// replace the try block inside proceedNow with:
try {
  const quotes = await journeyApi.quote(CURRENT_LOCATION, draft.destination);
  setTransportOptions(quotes);
  navigation.navigate("TransportOptions");
} catch (e: any) {
  setError(e.detail ?? "Could not calculate route.");
} finally {
  setLoading(false);
}