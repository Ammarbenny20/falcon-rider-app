import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { safetyApi } from "../../api/safetyApi";
import { COLORS } from "../../constants/config";

const CATEGORIES = ["DRIVER_BEHAVIOR", "VEHICLE_CONDITION", "ROUTE_DEVIATION", "SAFETY_CONCERN", "OTHER"];

export default function ReportIssueScreen() {
  const { params } = useRoute() as { params: { journeyId: string } };
  const navigation = useNavigation();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!description.trim()) {
      setError("Please describe what happened.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await safetyApi.reportIncident({ journey: params.journeyId, category, description });
      setSubmitted(true);
    } catch (e: any) {
      setError(e.detail ?? "Could not submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.confirmTitle}>Report received</Text>
        <Text style={styles.confirmSub}>Our safety team has been notified and will follow up.</Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Report an issue</Text>

      <View style={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            style={[styles.categoryChip, category === c && styles.categoryChipActive]}
            onPress={() => setCategory(c)}
          >
            <Text style={[styles.categoryText, category === c && styles.categoryTextActive]}>
              {c.replace(/_/g, " ")}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.textArea}
        multiline
        placeholder="What happened?"
        value={description}
        onChangeText={setDescription}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={submit} disabled={submitting}>
        {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Submit report</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 16 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  categoryChip: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  categoryChipActive: { backgroundColor: COLORS.error, borderColor: COLORS.error },
  categoryText: { fontSize: 12, color: COLORS.charcoal },
  categoryTextActive: { color: COLORS.white, fontWeight: "700" },
  textArea: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 14,
    padding: 14, minHeight: 120, textAlignVertical: "top", marginBottom: 16, fontSize: 14,
  },
  error: { color: COLORS.error, marginBottom: 12 },
  button: { backgroundColor: COLORS.green, borderRadius: 14, padding: 16, alignItems: "center" },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
  confirmTitle: { fontSize: 20, fontWeight: "700", color: COLORS.darkGreen, marginTop: 100, textAlign: "center" },
  confirmSub: { fontSize: 14, color: COLORS.mutedText, marginTop: 12, marginBottom: 24, textAlign: "center" },
});