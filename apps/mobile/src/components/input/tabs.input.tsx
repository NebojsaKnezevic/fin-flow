import * as React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import { expenseSourceEnum } from "@api/schema";

type ExpenseSource = (typeof expenseSourceEnum.enumValues)[number];

const modeConfig: Record<ExpenseSource, { label: string; icon: string }> = {
  basic: { label: "Basic", icon: "pencil" },
  camera: { label: "Camera", icon: "camera" },
  voice: { label: "Voice", icon: "microphone" },
};

const InputTabs = () => {
  const options = expenseSourceEnum.enumValues;
  const [value, setValue] = useState<string>(options[0]);

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={options.map((x) => ({
          value: x,
          label: modeConfig[x].label,
          icon: modeConfig[x].icon,
        }))}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default InputTabs;
