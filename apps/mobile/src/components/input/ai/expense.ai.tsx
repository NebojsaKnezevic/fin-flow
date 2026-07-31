import { JSX } from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  TextInput,
  ActivityIndicator,
  Text,
  useTheme,
} from "react-native-paper";
import { useExpenseStore } from "../../../../store/expense.store";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function ExpenseAI(): JSX.Element {
  const isLoading = useExpenseStore((s) => s.isLoading);
  const text = useExpenseStore((s) => s.aiTextInput);
  const setText = useExpenseStore((s) => s.setAiTextInput);
  const theme = useTheme();

  return (
    <View
      style={styles.inner}
      //   behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* LOADER */}
      <View style={styles.contentContainer}>
        {isLoading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator
              animating={true}
              size={60}
              color={theme.colors.primary}
            />
            <Text
              variant="bodyLarge"
              style={{ marginTop: 16, color: theme.colors.outline }}
            >
              Parsing your expenses...
            </Text>
          </View>
        )}
      </View>

      {/* INPUT */}
      <View style={styles.inputWrapper}>
        <TextInput
          mode="outlined"
          placeholder="Tell me your expenses..."
          value={text}
          onChangeText={setText}
          multiline
          disabled={isLoading}
          style={styles.input}
          outlineStyle={styles.outline}
          right={
            <TextInput.Icon
              icon="send"
              disabled={!text.trim() || isLoading}
              color={
                text.trim() && !isLoading
                  ? theme.colors.primary
                  : theme.colors.outline
              }
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    width: "100%",
    justifyContent: "flex-end",
  },
  input: {
    maxHeight: 160,
    minHeight: 46,
    width: "100%",
  },
  outline: {
    borderRadius: 16,
  },
});
