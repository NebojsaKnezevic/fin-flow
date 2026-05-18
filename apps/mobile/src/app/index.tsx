import { Text, View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Test React Native</Text>
    </View>
  );
}
