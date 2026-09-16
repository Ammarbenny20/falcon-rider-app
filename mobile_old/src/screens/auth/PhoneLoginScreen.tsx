import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/RootNavigator";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../constants/config";

type Props = NativeStackScreenProps<AuthStackParamList, "PhoneLogin">;

export default function PhoneLoginScreen({ navigation, route }: Props) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { requestOtp, isLoading } = useAuthStore();

  const submit = async () => {
    setError(null);
    if (phone.trim().length < 9) {
      setError("Enter a valid phone number.");
      return;
    }
    try {
      await requestOtp(phone);
      navigation.navigate("OtpVerify", { phone, role: route.params.role });
    } catch (e: any) {
      setError(e.detail ?? "Could not send code. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter your phone number</Text>
      <Text style={styles.sub}>We'll send you a verification code.</Text>
      <TextInput
        style={styles.input}
        placeholder="+255 7XX XXX XXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        autoFocus
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={submit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Continue</Text>}
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
    padding: 16, fontSize: 16, marginBottom: 12,
  },
  error: { color: COLORS.error, marginBottom: 12 },
  button: { backgroundColor: COLORS.green, borderRadius: 14, padding: 16, alignItems: "center" },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
});