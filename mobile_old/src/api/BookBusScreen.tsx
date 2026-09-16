import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { busBookingApi } from "../../api/busBookingApi";
import { COLORS } from  /constants/config;

// Fixed demo coordinates for pickup/destination text fields — a full build
// would reuse DestinationSearchScreen's geocoding for these.
const PLACEHOLDER_COORDS = { lat: -6.7924, lng: 39.2083 };

export default function BookBusScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    contactPhone: "",
    organizationName: "",
    pickupLabel: "",
    destinationLabel: "",
    travelDate: "",
    windowStart: "",
    windowEnd: "",
    passengerCount: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setError(null);
    if (!form.contactPhone || !form.pickupLabel || !form.destinationLabel || !form.travelDate || !form.passengerCount) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await busBookingApi.create({
        contact_phone: form.contactPhone,
        organization_name: form.organizationName,
        pickup_label: form.pickupLabel,
        pickup_lat: PLACEHOLDER_COORDS.lat,
        pickup_lng: PLACEHOLDER_COORDS.lng,
        destination_label: form.destinationLabel,
        destination_lat: PLACEHOLDER_COORDS.lat,
        destination_lng: PLACEHOLDER_COORDS.lng,
        travel_date: form.travelDate,
        departure_window_start: form.windowStart || "08:00",
        departure_window_end: form.windowEnd || "09:00",
        passenger_count: parseInt(form.passengerCount, 10),
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e.detail ?? "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
    <Text style={styles.successTitle}>Request submitted</Text>
        <Text style={styles.successSub}>
          We'll review your request and confirm bus availability shortly. You can track its status
          under Journeys.
        </Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Done</Text>
        </Pressable>
    </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.heading}>Book a Bus</Text>
      <Text style={styles.sub}>For schools, companies, events, or any group trip.</Text>

      <Field label="Contact phone *" value={form.contactPhone} onChange={update("contactPhone")} keyboardType="phone-pad" />
      <Field label="Organization (optional)" value={form.organizationName} onChange={update("organizationName")} />
      <Field label="Pickup location *" value={form.pickupLabel} onChange={update("pickupLabel")} />
      <Field label="Destination *" value={form.destinationLabel} onChange={update("destinationLabel")} />
      <Field label="Travel date (YYYY-MM-DD) *" value={form.travelDate} onChange={update("travelDate")} />
      <Field label="Departure window start (HH:MM)" value={form.windowStart} onChange={update("windowStart")} />
      <Field label="Departure window end (HH:MM)" value={form.windowEnd} onChange={update("windowEnd")} />
      <Field label="Passenger count *" value={form.passengerCount} onChange={update("passengerCount")} keyboardType="number-pad" />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={submit} disabled={submitting}>
        {submitting ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Submit request</Text>}
      </Pressable>
    </ScrollView>
  );
}

function Field({
  label, value, onChange, keyboardType,
}: { label: string; value: string; onChange: (v: string) => void; keyboardType?: "phone-pad" | "number-pad" }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType={keyboardType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20, paddingTop: 60 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.charcoal, marginBottom: 4 },
  sub: { fontSize: 13, color: COLORS.mutedText, marginBottom: 20 },
  fieldLabel: { fontSize: 12, color: COLORS.mutedText, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 15 },
  error: { color: COLORS.error, marginBottom: 12 },
  button: { backgroundColor: COLORS.green, borderRadius: 14, padding: 16, alignItems: "center", marginTop: 8 },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
  successTitle: { fontSize: 20, fontWeight: "700", color: COLORS.darkGreen, marginTop: 100, textAlign: "center" },
  successSub: { fontSize: 14, color: COLORS.mutedText, marginTop: 12, textAlign: "center" },
});