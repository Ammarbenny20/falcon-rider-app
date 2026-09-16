import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, TextInput, Modal } from "react-native";
import { adminApi } from "../../api/adminApi";
import type { Provider } from "../../types";
import { COLORS } from "../../constants/config";

export default function AdminProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [correctionTarget, setCorrectionTarget] = useState<Provider | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.providers()
      .then((res) => setProviders(res.results))
      .catch((e) => setError(e.detail ?? "Could not load providers."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const approve = async (id: string) => {
    try {
      await adminApi.approveProvider(id);
      load();
    } catch (e: any) {
      setError(e.detail ?? "Could not approve.");
    }
  };

  const reject = async (id: string) => {
    try {
      await adminApi.rejectProvider(id, "");
      load();
    } catch (e: any) {
      setError(e.detail ?? "Could not reject.");
    }
  };

  const submitCorrection = async () => {
    if (!correctionTarget) return;
    try {
      await adminApi.requestCorrection(correctionTarget.id, notes);
      setCorrectionTarget(null);
      setNotes("");
      load();
    } catch (e: any) {
      setError(e.detail ?? "Could not request correction.");
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator color={COLORS.green} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Providers</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={providers}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.provider_type.replace(/_/g, " ")}</Text>
            <Text style={styles.cardSub}>Status: {item.status}</Text>
            <View style={styles.actionsRow}>
              <Pressable style={styles.approveBtn} onPress={() => approve(item.id)}>
                <Text style={styles.approveText}>Approve</Text>
              </Pressable>
              <Pressable style={styles.correctionBtn} onPress={() => setCorrectionTarget(item)}>
                <Text style={styles.correctionText}>Request correction</Text>
              </Pressable>
              <Pressable style={styles.rejectBtn} onPress={() => reject(item.id)}>
                <Text style={styles.rejectText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No providers found.</Text>}
      />

      <Modal visible={!!correctionTarget} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>What needs correcting?</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. License photo is blurry"
            />
            <View style={styles.actionsRow}>
              <Pressable style={styles.correctionBtn} onPress={() => setCorrectionTarget(null)}>
                <Text style={styles.correctionText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.approveBtn} onPress={submitCorrection}>
                <Text style={styles.approveText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 16 },
  card: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.charcoal },
  cardSub: { fontSize: 12, color: COLORS.mutedText, marginTop: 2, marginBottom: 10 },
  actionsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  approveBtn: { backgroundColor: COLORS.green, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  approveText: { color: COLORS.white, fontWeight: "700", fontSize: 12 },
  correctionBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  correctionText: { color: COLORS.charcoal, fontWeight: "600", fontSize: 12 },
  rejectBtn: { borderWidth: 1, borderColor: COLORS.error, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  rejectText: { color: COLORS.error, fontWeight: "600", fontSize: 12 },
  empty: { color: COLORS.mutedText, textAlign: "center", marginTop: 40 },
  error: { color: COLORS.error, marginBottom: 12 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: "700", color: COLORS.charcoal, marginBottom: 12 },
  modalInput: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
    padding: 12, minHeight: 80, marginBottom: 16, textAlignVertical: "top",
  },
});