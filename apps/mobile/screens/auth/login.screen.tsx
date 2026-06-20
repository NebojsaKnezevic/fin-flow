import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../client/client";
import { AxiosError } from "axios";
import useLoginScreenStyles from "./styles";
import { Notify } from "../../helpers/toast.helper";

export default function LoginScreen() {
  const styles = useLoginScreenStyles();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [secureText, setSecureText] = useState(true);
  // const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((s) => s.user);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/auth/login", { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // setError(JSON.stringify(user));
      Notify.success("Welcome back! 👋");
    },
    onError: (error: AxiosError) => {
      // setError(msg ?? JSON.stringify(error));
      const serverMessage = (error.response?.data as any)?.message || error.message;
      Notify.error(serverMessage, "Login Failed");
    },
  });

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Notify.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Notify.error("Invalid email address");
      return;
    }

    if (password.length < 8) {
      Notify.error("Password must be at least 8 characters long");
      return;
    }

    loginMutation.mutate();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="headlineLarge" style={styles.title}>
          FinFlow
        </Text>

        {/* <Text style={styles.error}>
          {error === "" ? "" : JSON.stringify(error)}
          {JSON.stringify(user)}
        </Text> */}

        <TextInput
          label="Email address"
          value={email}
          onChangeText={(s) => {
            setEmail(s);
          }}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        {/* <HelperText 
      type="error"
      visible={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
      >
        Invalid email address"
      </HelperText> */}

        <TextInput
          label="Password"
          value={password}
          onChangeText={(s) => setPwd(s)}
          mode="outlined"
          secureTextEntry={secureText}
          autoCapitalize="none"
          right={
            <TextInput.Icon
              icon={secureText ? "eye" : "eye-off"}
              onPress={() => setSecureText(!secureText)}
            />
          }
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          loading={loginMutation.isPending}
          disabled={loginMutation.isPending}
          style={styles.button}
        >
          Sign in
        </Button>

        <View style={styles.linkContainer}>
          <Text variant="bodyMedium" style={styles.linkText}>
            Don't have an account?
          </Text>
          <Button
            mode="text"
            compact
            onPress={() => router.push("/register")}
            labelStyle={styles.linkButtonLabel}
          >
            Sign up
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}