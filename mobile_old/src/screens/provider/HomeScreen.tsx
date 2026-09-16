import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Switch, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProviderStackParamList } from "../../navigation/ProviderNavigator";
import { useAuthStore } from "../../store/authStore";
import { useProviderStore } from "../../store/providerStore";
import { providerApi } from "../../api/providerApi";
import { journeyApi } from "../../api/journeyApi";
import { COLORS } from "../../constants/config";

type Nav = NativeStackNavigationProp<ProviderStackParamList>;
const POLL_INTERVAL_MS = 5000;

export default function ProviderHomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const { provider, isOnline, eligibilityBlockers, setProvider, setOnline, setEligibilityBlockers } =
    useProviderStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEligibility = useCallback(async (providerId: string) => {
    try {
      const { eligible, blockers } = await providerApi.eligibility(providerId);
      setEligibilityBlockers(eligible ? [] : blockers);
    } catch {
      // eligibility check failing shouldn't crash Home; toggle stays disabled
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    // user.id maps to provider profile server-side; assume provider.id fetched elsewhere on login
    // (kept simple here — full app fetches /providers/?user=<id> on auth hydrate)
  }, [user]);

  const toggleOnline = async (value: boolean) => {
    if (!provider) return;
    setLoading(true);
    setError(null);
    try {
      const updated = value
        ? await providerApi.goOnline(provider.id)
        : await providerApi.goOffline(provider.id);
      setProvider(updated);
    } catch (e: any) {
      setError(e.detail ?? "Could not update status.");
    } finally {
      setLoading(false);
    }
  };

  // Poll for a new incoming request while online.
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(async () => {
      try {
        const { results } = await providerApi.myPendingJourney();
        if (results.length > 0) {
          navigation.navigate("IncomingRequest", { journeyId: results[0].id });
        }
      } catch {
        // silent retry next tick — connection banner shown elsewhere
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isOnline, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>{isOnline ? "You're online" : "You're offline"}</Text>
        <Switch
          value={isOnline}
          onValueChange={toggleOnline}
          disabled={loading || eligibilityBlockers.length > 0}
          trackColor={{ true: COLORS.green, false: COLORS.border }}
        />
      </View>

      <Text style={styles.statusSub}>
        {isOnline
          ? "You're online and ready for journeys."
          : "You're offline. You won't receive new journey requests."}
      </Text>

      {eligibilityBlockers.length > 0 && (
        <View style={styles.blockerCard}>
          <Text style={styles.blockerTitle}>You're not ready to go online yet</Text>
          {eligibilityBlockers.map((b) => (
            <Text key={b} style={styles.blockerItem}>• {b}</Text>
          ))}
        </View>
      )}

      {isOnline && eligibilityBlockers.length === 0 && (
        <Text style={styles.waiting}>New requests will appear here.</Text>
      )}

      {loading && <ActivityIndicator color={COLORS.green} style={{ marginTop: 12 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statusLabel: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal },
  statusSub: { fontSize: 14, color: COLORS.mutedText, marginBottom: 20 },
  blockerCard: { backgroundColor: COLORS.softGreen, borderRadius: 16, padding: 16, marginBottom: 16 },
  blockerTitle: { fontWeight: "700", color: COLORS.charcoal, marginBottom: 8 },
  blockerItem: { color: COLORS.mutedText, fontSize: 13, marginBottom: 4 },
  waiting: { color: COLORS.mutedText, marginTop: 40, textAlign: "center" },
  error: { color: COLORS.error, marginTop: 12 },
});