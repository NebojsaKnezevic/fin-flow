import { Stack } from "expo-router";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useThemeStore } from "../../store/theme.store";
import { useMemo } from "react";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";
import { Dimensions } from "react-native";
import "react-native-paper";

export type AppTheme = MD3Theme & {
  fontStyles: {
    casual: {
      fontSize: number;
      fontWeight:
        | "normal"
        | "bold"
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900";
      color: string;
      marginRight: number;
      minWidth: number;
    };
  };
  ripple: {
    color: string;
  };
};
const { width } = Dimensions.get("window");

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#047857",
        width: width * 0.95,
        borderRadius: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{ fontSize: 14, color: "#666" }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#ef4444",
        width: width * 0.95,
        borderRadius: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{ fontSize: 14, color: "#666" }}
    />
  ),
};

const fintechLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#047857",
    secondary: "#10b981",
    background: "#ffffff",
    surface: "#ffffff",
    primaryContainer: "#ecfdf5",
    onPrimaryContainer: "#047857",
    outline: "#a7f3d0",
    error: "#dc2626",
  },
  fontStyles: {
    casual: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#888",
      marginRight: 8,
      minWidth: 110,
    },
  },
  ripple: {
    color: "rgba(0, 0, 0, 0.08)",
  },
};

const fintechDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#10b981",
    secondary: "#34d399",
    background: "#0f172a",
    surface: "#1e293b",
    primaryContainer: "#064e3b",
    onPrimaryContainer: "#a7f3d0",
    outline: "#0f766e",
    error: "#ef4444",
  },
  fontStyles: {
    casual: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#888",
      marginRight: 8,
      minWidth: 110,
    },
  },
  ripple: {
    color: "rgba(255, 255, 255, 0.12)",
  },
};

const queryClient = new QueryClient();

export default function Layout() {
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  const currentTheme = useMemo(
    () => (isDarkMode ? fintechDarkTheme : fintechLightTheme),
    [isDarkMode],
  );
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={currentTheme}>
        <Stack screenOptions={{ headerShown: false }} />

        <Toast config={toastConfig} />
      </PaperProvider>
    </QueryClientProvider>
  );
}
