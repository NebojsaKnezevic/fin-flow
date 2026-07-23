import { AppTheme } from "@/app/_layout";
import { JSX, useState } from "react";
import { View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { Notify } from "../../../../../helpers/toast.helper";
import { useExpenseStore } from "../../../../../store/expense.store";
// import MenuOptions from "./custom-date.input";

interface IPros {
  val?: string | number;
  label: string;
  setValue?: (text: string) => void;
  customLabel?: boolean;
  validation?: (t: string) => [boolean, string];
}

export default function CustomInputField({
  val,
  label,
  setValue,
  customLabel = true,
  validation,
}: IPros) {
  const theme: AppTheme = useTheme();

  const setValidationButton = useExpenseStore((s) => s.setValid);
  const [value, setVal] = useState(val?.toString() || "");
  const [error, setError] = useState("");

  if (val && validation) validation(val.toString());

  const setData = (t: string) => {
    const [isValid, msg] = validation ? validation(t) : [true, ""];
    setVal(t);

    if (!isValid) {
      setError(msg);
      setValidationButton(false);
    } else {
      setError("");
      setValidationButton(true);
    }

    if (setValue) {
      setValue(t);
    }
  };

  const inputStyle = {
    flex: 1,
    backgroundColor: "transparent",
    height: 35,
    paddingHorizontal: 0,
    margin: 0,
    fontSize: 14,
    color: "#333",
    textAlign: "right" as const,
  };

  return (
    <View style={{ width: "100%", marginVertical: 4 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 8,
          // height: 35,
          marginVertical: 0,
        }}
      >
        {customLabel ? (
          <>
            <Text style={theme.fontStyles.casual}>{label}</Text>
            <TextInput
              value={value}
              dense
              error={!!error}
              onChangeText={setData}
              placeholder=""
              style={inputStyle}
            />
            {/* <MenuOptions /> */}
          </>
        ) : (
          <TextInput
            value={val?.toString()}
            label={label}
            error={!!error}
            onChangeText={setData}
            placeholder=""
            style={inputStyle}
          />
        )}
      </View>

      {!!error && (
        <Text
          style={{
            fontSize: 12,
            color: theme.colors?.error || "red",
            paddingHorizontal: 8,
            marginTop: 0,
            textAlign: "left",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
