import { JSX, useState } from "react";
import { StyleSheet, View, Platform, ScrollView } from "react-native";
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
import ImageBanner from "./banner.ai";

export default function ExpenseAI(): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const imgBase64 = useExpenseStore((s) => s.imageBase64);

  const isLoading = useExpenseStore((s) => s.isLoading);
  const setLoading = useExpenseStore((s) => s.setIsLoading);
  const text = useExpenseStore((s) => s.aiTextInput);
  const setText = useExpenseStore((s) => s.setAiTextInput);
  const setExpense = useExpenseStore((s) => s.setExpense);
  const theme = useTheme();

  const { mutate: createExpenseAI, isPending } = useCreateExpenseAI();

  // ==========================================================
  //                          VAZNO
  // ==========================================================
  // Treba namestiti da mogu da slikam vise slika bez prekida i da se to sacuva lepo na FE.
  // Onda treba refaktorisati BE da prihvati taj niz slika.

  const handleAiSubmit = (promptText: string) => {
    setLoading(true);

    createExpenseAI(
      {
        prompt: promptText,
        imageBase64: imgBase64.length > 0 ? imgBase64[0].img : "",
      },
      {
        onSuccess: (responseData) => {
          const parsed = aiExpenseExtractionSchema.safeParse(responseData);

          if (!parsed.success) {
            // console.error("Zod Schema Error:", parsed.error.format());
            Notify.error("AI returned invalid expense structure");
            return;
          }

          setExpense(transformAiResponseToExpense(parsed.data));
          Notify.success("Expense populated from AI!");
        },
        onError: (error) => {
          console.error("AI Request Error:", error);
          Notify.error("Failed to process AI request");
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  };

  return (
    <View
      style={styles.inner}
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Text style={{ color: "white", marginTop: 20 }}>{text}</Text>

      <ScrollView
        indicatorStyle="white"
        style={styles.imgSection}
        contentContainerStyle={styles.imgSectionContent}
        showsVerticalScrollIndicator={true}
      >
        {imgBase64.length > 0 &&
          imgBase64.map((img, i) => (
            <ImageBanner
              imageBase64={img.img}
              index={i}
              isSelected={img.isSelected}
            />
          ))}
      </ScrollView>

      {/* LOADER */}

      {isLoading && (
        <View style={styles.contentContainer}>
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
        </View>
      )}

      {/* INPUT */}
      <View style={styles.inputWrapper}>
        <TextInput
          mode="outlined"
          placeholder={isFocused ? "" : "Tell me your expenses..."}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // placeholder="Tell me your expenses..."
          value={text}
          onChangeText={setText}
          multiline
          disabled={isLoading}
          style={styles.input}
          contentStyle={styles.inputContent}
          outlineStyle={styles.outline}
          textAlign="center"
          verticalAlign="middle"
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
        showsVerticalScrollIndicator={true}
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
    height: "auto",
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    width: "100%",
    justifyContent: "flex-end",
    alignContent: "center",
  },
  input: {
    maxHeight: 160,
    minHeight: 56,
    width: "100%",
  },
  inputContent: {
    textAlignVertical: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? 14 : 0,
    paddingBottom: 0,
  },
  outline: {
    borderRadius: 16,

    // backgroundColor: "red",
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
  imgSection: {
    flex: 1,
    width: "100%",
  },
  imgSectionContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    paddingVertical: 10,
  },
});
