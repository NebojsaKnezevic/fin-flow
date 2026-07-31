import { Text, TextInput, useTheme } from "react-native-paper";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import InputTabs from "@/components/input/tabs.input";
// import InputForm from "@/components/input/basic/form.input";
// import { insertExpenseSchema } from "@api/schema";
// import ExpenseList from "@/components/input/basic/list.input";
import Expense from "@/components/input/basic/expense.input";
import { useState } from "react";
import ExpenseAI from "@/components/input/ai/expense.ai";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function InputScreen() {
  // const keys: string[] = Object.keys(insertExpenseSchema.shape);
  const [value, setValue] = useState<string>("basic");

  // const handleSend = () => {
  //   if (text.trim() && !isLoading) {
  //     onSubmit(text.trim());
  //     setText("");
  //   }
  // };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={styles.tabWrapper}>
        <InputTabs value={value} setValue={(x: string) => setValue(x)} />
      </View>

      <View style={styles.content}>
        {/* <Text variant="headlineLarge">Welcome back! </Text> */}

        {/* <ExpenseList /> */}
        {value.toLowerCase() === "basic" && <Expense />}
        {value.toLowerCase() === "ai" && <ExpenseAI />}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  tabWrapper: {
    paddingTop: 50,
    width: "100%",
  },
  content: {
    flex: 1,
    // justifyContent: "flex-start",
    // alignItems: "stretch",
    paddingHorizontal: 20,
    gap: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
