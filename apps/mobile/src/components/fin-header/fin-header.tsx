import { ReactElement } from "react";
import { View, StyleSheet , Text} from "react-native";


export default function FinHeader(): ReactElement {
   const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={{ alignItems: "center", marginTop: 0 }}>
      <Text style={styles.date}>{currentDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: "green",
    marginTop: 4,
    marginBottom: 30,
  },
});