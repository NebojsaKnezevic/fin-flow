import { AppTheme } from "@/app/_layout";
import { View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

interface IPros {
  val?: string | number;
  label: string;
  setValue?: (text: string) => void;
  //   val: string;
}

export default function CustomInputField({ val, label, setValue }: IPros) {
  const theme: AppTheme = useTheme();
  const getDisplayValue = () => {
    if (val === undefined || val === null) return "";

    if (typeof val === "number") {
      return val.toFixed(2).toString();
    }

    return String(val);
  };

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
      <Text style={theme.fontStyles.casual}>{label}</Text>

      <TextInput
        value={getDisplayValue()}
        dense
        //   underlineColor="transparent"
        //   activeUnderlineColor="transparent"
        onChangeText={(text) => {
          if (setValue) setValue(text);
        }}
        placeholder=""
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
