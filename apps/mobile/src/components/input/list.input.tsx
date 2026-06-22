import { insertExpenseSchema } from "@api/schema";
import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, IconButton, List } from "react-native-paper";
import InputForm from "./form.input";
import { useState } from "react";

const ExpenseList = () => {
  const keyList = Object.keys(insertExpenseSchema.shape);
  const [expenseItems, setExItems] = useState<string[]>(["item-0"]);

  const addItem = () => {
    setExItems((prev) => [...prev, `item-${Date.now()}`]);
  };

  const removeLastItem = () => {
    if (expenseItems.length > 1) {
      setExItems((prev) => prev.slice(0, -1));
    }
  };

  const Items = () => {
    return expenseItems.map((id, i) => (
      <View key={id} style={styles.accordionContainer}>
        <List.Accordion
          id={id}
          title={`Expense Item #${i + 1}`}
          left={(props) => (
            <List.Icon {...props} icon="file-document-outline" />
          )}
          style={styles.accordion}
        >
          <View style={styles.accordionContent}>
            {keyList.map((k) => {
              const formattedLabel = k.charAt(0).toUpperCase() + k.slice(1);
              return <InputForm key={`${id}-${k}`} label={formattedLabel} />;
            })}
          </View>
        </List.Accordion>

        {/* <View style={styles.deleteButtonWrapper}>
          <IconButton
            icon="close"
            iconColor="red"
            size={20}
            onPress={() => removeItem(id)}
          />
        </View> */}
      </View>
    ));
  };

  return (
    <List.Section title="Items">
      <List.AccordionGroup>{Items()}</List.AccordionGroup>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained-tonal"
          onPress={removeLastItem}
          icon="minus"
          style={styles.button}
        >
          Remove Item
        </Button>

        <Button
          mode="contained-tonal"
          onPress={addItem}
          icon="plus"
          style={styles.button}
        >
          Add Item
        </Button>
      </View>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    position: "relative",
    justifyContent: "center",
  },
  accordion: {
    paddingRight: 48,
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  deleteButtonWrapper: {
    position: "absolute",
    left: 5,
    zIndex: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    // gap: 10,
  },
  button: {
    margin: 10,
    flex: 1,
  },
});

export default ExpenseList;
