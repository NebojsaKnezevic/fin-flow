import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";

interface IPros {
  val?: string;
  label: string;
  //   val: string;
}

export default function CustomInputField({ val, label }: IPros) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
        marginVertical: 4,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",

          color: "#888",
          marginRight: 8,
          minWidth: 110,
        }}
      >
        {label}
      </Text>

      <TextInput
        value={val}
        dense
        //   underlineColor="transparent"
        //   activeUnderlineColor="transparent"
        placeholder="" // Pošto nema labele unutra, placeholder dobro dođe
        style={{
          flex: 1,
          backgroundColor: "transparent",
          height: 35,
          paddingHorizontal: 0,
          margin: 0,
          fontSize: 14,
          color: "#333",
        }}
      />
    </View>
  );
}
