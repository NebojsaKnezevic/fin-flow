import { useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useMemo } from "react";

export default function useLoginScreenStyles() {
  const theme = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        keyboardView: {
          flex: 1,
        },
        container: {
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
          backgroundColor: theme.colors.background,
        },
        title: {
          textAlign: "center",
          marginBottom: 24,
          fontWeight: "bold",
          color: theme.colors.primary,
        },
        input: { marginTop: 6 },
        button: { marginTop: 18, paddingVertical: 4 },
        linkContainer: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
        },
        linkText: {
          color: "#64748b",
        },
        linkButtonLabel: {
          fontWeight: "bold",
        },
        error: {
          textAlign: "center",
          marginBottom: 24,
          fontWeight: "bold",
          color: theme.colors.error,
        },
      }),
    [theme],
  );
}
