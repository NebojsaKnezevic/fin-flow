import { Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import InputTabs from "@/components/input/tabs";

export default function InputScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        <InputTabs />
      </View>

      <View style={styles.content}>
        <Text>Test Input Screen</Text>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f5f5f5",
  },
});
