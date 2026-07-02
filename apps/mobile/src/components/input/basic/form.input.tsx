import { useState } from "react";
import { TextInput } from "react-native-paper";

interface IProps {
  label: string;
}

export default function InputForm({ label }: IProps) {
  const [text, setText] = useState("");

  return (
    <TextInput
      label={label}
      value={text}
      onChangeText={(text) => setText(text)}
    />
  );
}
