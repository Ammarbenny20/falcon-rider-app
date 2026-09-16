import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/RootNavigator";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../constants/config";

type Props = NativeStackScreenProps<AuthStackParamList, "OtpVerify">;

export default function OtpVerifyScreen({ route }: Props) {
  const { phone, role } = route.params;
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { verifyOtp, isLoading } = useAuthStore();

  const submit = async () => {
    setError(null);
    try {
      await verifyOtp(phone, code, role);
      // Navigation switches automatically via RootNavigator once isAuthenticated flips.
    } catch (e: any) {
      setError(e.detail ?? "Incorrect code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter the code</Text>
      <Text style={styles.sub}>Sent to {phone}</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit code"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        autoFocus
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={submit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Verify</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 24, justifyContent: "center" },
  heading: { fontSize: 22, fontWeight: "700", color: COLORS.charcoal, marginBottom: 6 },
  sub: { fontSize: 14, color: COLORS.mutedText, marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 14,
    padding: 16, fontSize: 20, letterSpacing: 4, textAlign: "center", marginBottom: 12,
  },
  error: { color: COLORS.error, marginBottom: 12 },
  button: { backgroundColor: COLORS.green, borderRadius: 14, padding: 16, alignItems: "center" },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
});