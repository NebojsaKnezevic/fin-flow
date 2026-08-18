import { JSX, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  TextInput,
  ActivityIndicator,
  Text,
  useTheme,
  Modal,
  Portal,
  IconButton,
} from "react-native-paper";
import { useExpenseStore } from "../../../../store/expense.store";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useCreateExpenseAI } from "../../../../hooks/mutations/useExpense";
import { Notify } from "../../../../helpers/toast.helper";
import {
  aiExpenseExtractionSchema,
  transformAiResponseToExpense,
} from "@repo/models";
import ExpenseCamera from "./camera.ai";

export default function ExpenseAI(): JSX.Element {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const imgBase64 = useExpenseStore((s) => s.imageBase64);

  const isLoading = useExpenseStore((s) => s.isLoading);
  const text = useExpenseStore((s) => s.aiTextInput);
  const setText = useExpenseStore((s) => s.setAiTextInput);
  const setExpense = useExpenseStore((s) => s.setExpanse);
  const theme = useTheme();

  const { mutate: createExpenseAI, isPending } = useCreateExpenseAI();

  const handleAiSubmit = (promptText: string) => {
    createExpenseAI(
      { prompt: promptText, imageBase64: imgBase64 },
      {
        onSuccess: (responseData) => {
          const parsed = aiExpenseExtractionSchema.safeParse(responseData);

          if (!parsed.success) {
            console.error("Zod Schema Error:", parsed.error.format());
            Notify.error("AI returned invalid expense structure");
            return;
          }
          // console.log(parsed.data);
          // Ubacivanje validiranih podataka u Zustand store
          setExpense(transformAiResponseToExpense(parsed.data));
          Notify.success("Expense populated from AI!");
          // console.log("imgBase64: ", imgBase64);
        },
      },
    );
  };

  return (
    <View
      style={styles.inner}
      //   behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Text style={{ color: "white", marginTop: 150 }}>{text}</Text>
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
          left={
            <TextInput.Icon
              icon="camera"
              onPress={() => setIsCameraVisible(true)}
            />
          }
          right={
            <TextInput.Icon
              icon="send"
              disabled={!text.trim() || isLoading}
              onPress={() => {
                handleAiSubmit(text);
              }}
              color={
                text.trim() && !isPending
                  ? theme.colors.primary
                  : theme.colors.outline
              }
            />
          }
        />

        {/* PAPER PORTAL + MODAL FOR CAMERA */}
        <Portal>
          <Modal
            visible={isCameraVisible}
            onDismiss={() => setIsCameraVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <View style={styles.cameraWrapper}>
              <IconButton
                icon="close"
                iconColor="#fff"
                size={28}
                style={styles.closeButton}
                onPress={() => setIsCameraVisible(false)}
              />

              {/* CAMERA View */}
              <ExpenseCamera onClose={() => setIsCameraVisible(false)} />
            </View>
          </Modal>
        </Portal>
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
  modalContent: {
    flex: 1,
    backgroundColor: "#000",
    margin: 0, // Za prikaz preko celog ekrana
  },
  cameraWrapper: {
    flex: 1,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
