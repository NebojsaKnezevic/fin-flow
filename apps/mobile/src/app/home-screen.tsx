import { ReactElement, useEffect } from "react";
import { View, Text, Platform, StyleSheet, Alert } from "react-native";
import * as Device from "expo-device";
import FinHeader from "../components/fin-header/fin-header";



export default function HomeScreen(): ReactElement {


    useEffect(() => {
    Alert.alert(
      "Device Information",
      `Platform: ${Platform.OS}\nDevice Model: ${Device.modelName}\nDevice Brand: ${Device.brand}`
    );
  }, []);

  return (
    <View style={styles.container}>
        <FinHeader />
      <Text>Test React Native</Text>
      <Text>Platform: {Platform.OS}</Text>
      <Text>Device Model: {Device.modelName}</Text>
      <Text>Device Brand: {Device.brand}</Text>
      <Text style={styles.text}></Text>
      {/* <Alert title="Device Information" message={`Platform: ${Platform.OS}\nDevice Model: ${Device.modelName}\nDevice Brand: ${Device.brand}`} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow"
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'red',
  }
});