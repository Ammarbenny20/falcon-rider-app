import React, { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PassengerStackParamList } from "../../navigation/PassengerNavigator";
import { routeApi } from "../../api/routeApi";
import { useJourneyStore } from "../../store/journeyStore";
import { COLORS } from "../../constants/config";

type Nav = NativeStackNavigationProp<PassengerStackParamList>;

interface Result { lat: number; lng: number; label: string }

export default function DestinationSearchScreen() {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setDestination = useJourneyStore((s) => s.setDestination);

  const search = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { results } = await routeApi.geocode(text);
      setResults(results);
    } catch (e: any) {
      setError(e.detail ?? "Search failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  const selectDestination = (r: Result) => {
    setDestination(r);
    navigation.navigate("NowPlan");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search destination — e.g. Mlimani City"
        value={query}
        onChangeText={search}
        autoFocus
      />

      {loading && <ActivityIndicator style={{ marginTop: 12 }} color={COLORS.green} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && query.length >= 2 && results.length === 0 && !error && (
        <Text style={styles.empty}>No matches found. Try a nearby landmark.</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item, i) => `${item.lat}-${item.lng}-${i}`}
        renderItem={({ item }) => (
          <Pressable style={styles.resultRow} onPress={() => selectDestination(item)}>
            <Text style={styles.resultLabel}>{item.label}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 14,
    padding: 16, fontSize: 16, marginBottom: 12,
  },
  error: { color: COLORS.error, marginTop: 8 },
  empty: { color: COLORS.mutedText, marginTop: 8 },
  resultRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  resultLabel: { fontSize: 15, color: COLORS.charcoal },
});