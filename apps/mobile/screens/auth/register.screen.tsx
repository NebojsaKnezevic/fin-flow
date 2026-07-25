import { View } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import useLoginScreenStyles from "./styles";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../client/client";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";

import { Notify } from "../../helpers/toast.helper";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const styles = useLoginScreenStyles();
  const [password, setPwd] = useState("");
  const [passwordRepeat, setPwdRepeat] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureTextRepeat, setSecureTextRepeat] = useState(true);
  // const [user, setUser] = useState(null);
  // const [err, setErr] = useState<any>(null);

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/auth/register", { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      //  setUser(data)
      Notify.success("Account created successfully! 👋");
      router.replace("/login");
    },
    onError: (e: AxiosError) => {
      // if(e.isAxiosError  && e.response)
      //   setErr(e.response.data || null)
      // else
      //   setErr(e.message);
      const serverMessage = (e.response?.data as any)?.message || e.message;
      Notify.error(JSON.stringify(e), "");
    },
  });

  const handleRegister = () => {
    //TO DO - validation
    if (!email || email.trim() === "") {
      Notify.error("Email is required", "Error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Notify.error("Invalid email address");
      return;
    }

    if (!password || password.trim() === "") {
      Notify.error("Password is mandatory");
      return;
    }
    if (password.length < 8) {
      Notify.error("Password must have 8 or more characters");
      return;
    }

    if (!passwordRepeat || passwordRepeat.trim() === "") {
      Notify.error("Repeated password is mandatory");
      return;
    }
    if (password !== passwordRepeat) {
      Notify.error("Passwords do not match");
      return;
    }

    mutation.mutate();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        contentContainerStyle={styles.container}
      >
        <Text variant="headlineLarge" style={styles.title}>
          FinFlow
        </Text>
        {/* <Text>
          {JSON.stringify(err)}
          {JSON.stringify(user)}
        </Text> */}
        {/* <Text>{email}</Text> */}

        <TextInput
          label={"Email"}
          onChangeText={(text: string) => {
            setEmail(text);
          }}
          mode="outlined"
          value={email}
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={(text: string) => {
            setPwd(text);
          }}
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

        <TextInput
          label="Repeat Password"
          mode="outlined"
          value={passwordRepeat}
          onChangeText={(text: string) => {
            setPwdRepeat(text);
          }}
          secureTextEntry={secureTextRepeat}
          autoCapitalize="none"
          right={
            <TextInput.Icon
              icon={secureTextRepeat ? "eye" : "eye-off"}
              onPress={() => setSecureTextRepeat(!secureTextRepeat)}
            />
          }
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={mutation.isPending}
          disabled={mutation.isPending}
          style={styles.button}
        >
          Submit
        </Button>

        <View style={styles.linkContainer}>
          <Text variant="bodyMedium" style={styles.linkText}>
            Don't have an account?
          </Text>
          <Button
            mode="text"
            compact
            onPress={() => router.push("/login")}
            labelStyle={styles.linkButtonLabel}
          >
            Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
