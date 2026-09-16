import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, StyleSheet, ActivityIndicator, Modal } from "react-native";
import { supportApi } from "../../api/supportApi";
import type { SupportTicket } from "../../types";
import { COLORS } from "../../constants/config";

export default function SupportScreen() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    supportApi.list().then((res) => setTickets(res.results)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async () => {
    if (!subject.trim() || !description.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    try {
      await supportApi.create(subject, description);
      setShowNew(false);
      setSubject("");
      setDescription("");
      setError(null);
      load();
    } catch (e: any) {
      setError(e.detail ?? "Could not submit ticket.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Support</Text>
        <Pressable style={styles.newBtn} onPress={() => setShowNew(true)}>
          <Text style={styles.newBtnText}>New ticket</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.green} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowTitle}>{item.subject}</Text>
              <Text style={styles.rowSub}>{item.status.replace(/_/g, " ")}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No support tickets yet.</Text>}
        />
      )}

      <Modal visible={showNew} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New support ticket</Text>
            <TextInput style={styles.input} placeholder="Subject" value={subject} onChangeText={setSubject} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your issue"
              multiline
              value={description}
              onChangeText={setDescription}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.actionsRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowNew(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={submit}>
                <Text style={styles.submitText}>Submit</Text>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal },
  newBtn: { backgroundColor: COLORS.green, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  newBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 12 },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowTitle: { fontSize: 15, fontWeight: "600", color: COLORS.charcoal },
  rowSub: { fontSize: 12, color: COLORS.mutedText, marginTop: 2 },
  empty: { color: COLORS.mutedText, textAlign: "center", marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: "700", color: COLORS.charcoal, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, marginBottom: 12 },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  error: { color: COLORS.error, marginBottom: 12 },
  actionsRow: { flexDirection: "row", gap: 12 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, alignItems: "center" },
  cancelText: { color: COLORS.charcoal, fontWeight: "700" },
  submitBtn: { flex: 1, backgroundColor: COLORS.green, borderRadius: 14, padding: 14, alignItems: "center" },
  submitText: { color: COLORS.white, fontWeight: "700" },
});