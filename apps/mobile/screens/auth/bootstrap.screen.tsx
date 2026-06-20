import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { Text } from "react-native-paper";
import { View } from "react-native";
import useLoginScreenStyles from "./styles";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../client/client";
import * as SecureStore from "expo-secure-store";
import { Notify } from "../../helpers/toast.helper";

export default function AuthBootstrap() {
  const styles = useLoginScreenStyles();

  const [token, setToken] = useState<string | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    async function checkToken() {
      try {
        const storedToken = await SecureStore.getItemAsync("user_token");
        setToken(storedToken);
      } catch (e) {
        Notify.error("Error while reading SecureStore");
      } finally {
        setIsCheckingToken(false);
      }
    }
    checkToken();
  }, []);

  const user = useQuery({
    queryKey: ["authBootstrap", token],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response.data;
    },
    retry: false,
    enabled: !!token,
  });

  useEffect(() => {
    if (user.isError) {
      Notify.error("Session expired or server is down");
    }
    if (user.data) {
      Notify.success("Welcome back!");
      // TO DO: save user in zustand
    }
  }, [user.isError, user.data]);

  // ---- RENDER ----

  if (isCheckingToken || (token && user.isLoading)) {
    return (
      <View style={styles.container}>
        <Text variant="displayLarge" style={styles.title}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (user.isError) {
    return <Redirect href="/login" />;
  }

  if (user.data) {
    // return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}
