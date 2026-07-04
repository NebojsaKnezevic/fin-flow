import { AppTheme } from "@/app/_layout";
import { JSX } from "react";
import { View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

interface IPros {
  val?: string | number;
  label: string;
  setValue?: (text: string) => void;
  customLabel?: boolean;
  //   val: string;
}

export default function CustomInputField({
  val,
  label,
  setValue,
  customLabel = true,
}: IPros) {
  const theme: AppTheme = useTheme();
  const getDisplayValue = () => {
    if (val === undefined || val === null) return "";

    if (typeof val === "number") {
      return val.toFixed(2).toString();
    }

    return String(val);
  };

  const el: JSX.Element = customLabel ? (
    <>
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
    </>
  ) : (
    <TextInput
      value={getDisplayValue()}
      label={label}
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
        // maxWidth: "50%",
        color: "#333",
      }}
    />
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 8,
        marginVertical: 2,
        flex: 1,
      }}
    >
      {el}
    </View>
  );
}
