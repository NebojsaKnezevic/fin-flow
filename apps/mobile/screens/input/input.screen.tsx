import { Text } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";
import InputTabs from "@/components/input/tabs.input";
import InputForm from "@/components/input/form.input";
import { insertExpenseSchema } from "@api/schema";
import ExpenseList from "@/components/input/list.input";

export default function InputScreen() {
  const keys: string[] = Object.keys(insertExpenseSchema.shape);

  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        <InputTabs />
      </View>

      <ScrollView style={styles.content}>
        <Text>Test Input Screen</Text>
        {/* {keys.map((k) => {
          return (
            <InputForm label={k[0].toUpperCase() + k.substring(1, k.length)} />
          );
        })} */}
        <ExpenseList />
      </ScrollView>
    </View>
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
