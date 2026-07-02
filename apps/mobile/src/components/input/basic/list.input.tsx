import { InsertExpense, insertExpenseSchema } from "@api/schema";
import * as React from "react";
import { View, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  List,
} from "react-native-paper";
import InputForm from "./form.input";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../client/client";

const fetchExpenses = async ({ pageParam = 1 }) => {
  const { data } = await apiClient.get(`/expenses?page=${pageParam}&limit=10`);
  return data;
};
const ExpenseList = () => {
  const keyList = Object.keys(insertExpenseSchema.shape);
  const [expenseItems, setExItems] = useState<string[]>(["item-0"]);

  const infiniteScroll = useInfiniteQuery({
    queryKey: ["expenses", "infinite"],
    queryFn: fetchExpenses,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
  });

  const expenses: InsertExpense[] =
    infiniteScroll.data?.pages.flatMap((page) => page.data) || [];

  const addItem = () => {
    setExItems((prev) => [...prev, `item-${Date.now()}`]);
  };

  const removeLastItem = () => {
    if (expenseItems.length > 1) {
      setExItems((prev) => prev.slice(0, -1));
    }
  };

  if (infiniteScroll.isLoading) {
    return <ActivityIndicator animating />;
  }

  // if (infiniteScroll.isError) {
  //     return <Text>Error loading items.</Text>;
  // }

  return (
    <List.Section title="Items">
      <List.AccordionGroup>
        {expenseItems.map((expense, i) => (
          <View key={i} style={styles.accordionContainer}>
            <List.Accordion
              id={i}
              title={`${i || "Unknown"}`}
              // description={
              //   expense.createdAt ||
              //   (expense.createdAt as Date).toLocaleDateString() ||
              //   ""
              // }
              left={(props) => (
                <List.Icon {...props} icon="file-document-outline" />
              )}
              style={styles.accordion}
            >
              <View style={styles.accordionContent}>
                {keyList.map((k) => {
                  const formattedLabel = k.charAt(0).toUpperCase() + k.slice(1);
                  return <InputForm key={`${i}-${k}`} label={formattedLabel} />;
                })}
              </View>
            </List.Accordion>
          </View>
        ))}
      </List.AccordionGroup>

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
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    margin: 10,
    flex: 1,
  },
});

export default ExpenseList;
