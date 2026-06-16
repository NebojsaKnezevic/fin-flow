import { View } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import useLoginScreenStyles from "./styles";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {apiClient} from '../../client/client'
import { AxiosError } from "axios";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const styles = useLoginScreenStyles();
  const [password, setPwd] = useState("");
  const [passwordRepeat, setPwdRepeat] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureTextRepeat, setSecureTextRepeat] = useState(true);
  // const [user, setUser] = useState(null);
  //   const [err, setErr] = useState<any>(null);

    const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/auth/register", {email, password});
      return res.data;
    },
    onSuccess: (data) => {
        //  setUser(data)
         router.replace("/login")
    },
    onError: (e: AxiosError) => {
      // if(e.isAxiosError  && e.response)
      //   setErr(e.response.data || null)
      // else
      //   setErr(e.message);
    }
  });

  const handleRegister = (
   

  ) => {
 //TO DO - validation

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
        <Text>
          {JSON.stringify(err)}
              {JSON.stringify(user)}
        </Text>
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
          secureTextEntry={secureTextRepeat

          }
          autoCapitalize="none"
          right={
            <TextInput.Icon
              icon={secureTextRepeat ? "eye" : "eye-off"}
              onPress={() => setSecureTextRepeat(!secureTextRepeat)}
            />
          }
          style={styles.input}
        />

        <Button mode="contained" onPress={() => mutation.mutate()} style={styles.button}>
          Submit
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
