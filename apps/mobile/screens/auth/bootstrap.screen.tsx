import { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";
import useLoginScreenStyles from "./styles";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../client/client";
import * as SecureStore from "expo-secure-store";
import { Notify } from "../../helpers/toast.helper";
import { useAuthStore } from "../../store/auth.store";
import { UserWithId } from "@api/schema";
import { useRouter } from "expo-router";

export default function AuthBootstrap() {
  const styles = useLoginScreenStyles();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [isReadingStore, setIsReadingStore] = useState(true);

  const authZustand = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    async function checkToken() {
      try {
        const storedToken = await SecureStore.getItemAsync("user_token");
        setToken(storedToken);
      } catch (e) {
        Notify.error("Error while reading SecureStore");
      } finally {
        setIsReadingStore(false);
      }
    }
    checkToken();
  }, []);

  const {
    data: userData,
    isError,
    isLoading: isQueryLoading,
  } = useQuery({
    queryKey: ["authBootstrap", token],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response.data as UserWithId;
    },
    retry: false,
    enabled: !!token,
  });

  useEffect(() => {
    if (isReadingStore) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (isQueryLoading) return;

    if (isError) {
      Notify.error("Session expired or server is down");
      router.replace("/login");
      return;
    }

    if (userData) {
      authZustand(userData, token);
      Notify.success(`Logged in as ${userData.email}`);
      router.replace("/app");
    }
  }, [isReadingStore, token, isQueryLoading, isError, userData]);

  return (
    <View style={styles.container}>
      <Text variant="displayLarge" style={styles.title}>
        Loading...
      </Text>
    </View>
  );
}
