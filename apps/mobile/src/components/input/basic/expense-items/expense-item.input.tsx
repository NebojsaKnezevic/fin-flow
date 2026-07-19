import React, { useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import {
  TextInput,
  Text,
  IconButton,
  useTheme,
  Button,
  Chip,
} from "react-native-paper";
import { AppTheme } from "@/app/_layout";
import {
  ExpenseItemObj,
  useExpenseStore,
} from "../../../../../store/expense.store";
// import CategoryInput from "./categories/category.input";
import { apiClient } from "../../../../../client/client";
import { useQuery } from "@tanstack/react-query";
import SearchDropDown from "./categories/category.-search.input";
import { ExpenseCategory } from "@api/schema";
import { useCategories } from "../../../../../hooks/queries/useCategories";

function getDescendants(id: number, categories: ExpenseCategory[]): number[] {
  const children = categories.filter((c) => c.parentId === id);
  let result: number[] = [];

  for (const child of children) {
    result.push(child.id);
    result.push(...getDescendants(child.id, categories));
  }

  return [id, ...result];
}

export default function ExpenseItems() {
  const theme = useTheme() as AppTheme;

  const categories = useCategories();

  // if(categories.data)

  const items = useExpenseStore((s) => s.expenseItems);
  const addItemInStore = useExpenseStore((s) => s.addExpenseItem);
  const updateItemInStore = useExpenseStore((s) => s.updateExpenseItem);
  const removeItemFromStore = useExpenseStore((s) => s.removeExpenseItem);

  const [visibleMenuIndex, setVisibleMenuIndex] = useState<number | null>(null);

  const addItem = () => {
    addItemInStore({
      price: 0,
      quantity: 1,
      categories: [],
    });
  };

  const toggleCategory = (
    catId: number,
    item: ExpenseItemObj,
    index: number,
  ) => {
    if (item.categories.includes(catId)) {
      const descendantsId: number[] = getDescendants(
        catId,
        categories.data || [],
      );

      updateItemInStore(index, {
        ...item,
        categories: item.categories.filter((x) => !descendantsId.includes(x)),
      });
    } else {
      updateItemInStore(index, {
        ...item,
        categories: [...item.categories, catId],
      });
    }
  };

  const dynamicBackground = { backgroundColor: theme.colors.background };

  return (
    <View
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, dynamicBackground]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
        // keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainWrapper}>
            {/* Header */}
            <View style={[styles.headerRow, dynamicBackground]}>
              <View style={styles.headerGrid}>
                <Text style={styles.headerTextCategory}>Category</Text>
                <Text style={styles.headerTextQuantity}>Qnty.</Text>
                <Text style={styles.headerTextPrice}>Price</Text>
                <Text style={styles.headerTextTotal}>Total</Text>
              </View>
              <View style={styles.headerSpacer} />
            </View>
            {/* body */}
            {items.map((item, i) => {
              const isMenuOpen = visibleMenuIndex === i;

              const currentPrice =
                typeof item.price === "string"
                  ? parseFloat(item.price)
                  : item.price || 0;
              const currentQuantity =
                typeof item.quantity === "string"
                  ? parseFloat(item.quantity)
                  : item.quantity || 0;
              const totalCost = currentPrice * currentQuantity;

              return (
                // ROWs

                <View key={i} style={{ padding: 0, margin: 0, gap: 0 }}>
                  <View style={[styles.itemRow, dynamicBackground]}>
                    {/* <IconButton
                    icon="bin-outline"
                    iconColor="red"
                    size={16}
                    style={styles.iconButtonZeroMargin}
                    onPress={() => removeItemFromStore(i)}
                  /> */}

                    <View style={styles.itemGrid}>
                      {categories.isLoading ? (
                        <Text>Loading...</Text>
                      ) : categories.isError ? (
                        <Text>Error loading categories</Text>
                      ) : (
                        // <CategoryInput
                        //   item={item}
                        //   i={i}
                        //   categories={categories.data}
                        // />
                        <SearchDropDown
                          // categories={categories.data || []}
                          item={item}
                          index={i}
                        />
                      )}

                      <TextInput
                        value={item.quantity === 0 ? "" : String(item.quantity)}
                        onChangeText={(val) => {
                          const numericVal = val === "" ? 0 : Number(val);
                          if (!isNaN(numericVal)) {
                            let x = val.split(".");
                            if (x.length > 1 && x[x.length - 1].length < 3) {
                              updateItemInStore(i, {
                                ...item,
                                quantity: val,
                              });
                            } else if (x.length === 1) {
                              updateItemInStore(i, {
                                ...item,
                                quantity: val,
                              });
                            }
                          }
                        }}
                        dense
                        keyboardType="numeric"
                        style={[styles.input, styles.flex1_5]}
                      />

                      <TextInput
                        value={item.price === 0 ? "" : String(item.price)}
                        onChangeText={(val) => {
                          const numericVal = val === "" ? 0 : Number(val);
                          if (!isNaN(numericVal)) {
                            let x = val.split(".");
                            if (x.length > 1 && x[x.length - 1].length < 3) {
                              updateItemInStore(i, {
                                ...item,
                                price: val,
                              });
                            } else if (x.length === 1) {
                              updateItemInStore(i, {
                                ...item,
                                price: val,
                              });
                            }
                          }
                        }}
                        dense
                        keyboardType="decimal-pad"
                        style={[styles.input, styles.flex2]}
                      />

                      <TextInput
                        value={totalCost > 0 ? totalCost.toFixed(2) : "0.00"}
                        dense
                        disabled={true}
                        style={[styles.input, styles.flex2]}
                      />
                    </View>

                    <IconButton
                      icon="trash-can-outline"
                      iconColor="red"
                      size={16}
                      style={styles.iconButtonZeroMargin}
                      onPress={() => removeItemFromStore(i)}
                    />
                  </View>
                  {/* CHIPS */}
                  <View key={i} style={[styles.itemRow2, dynamicBackground]}>
                    <View style={styles.chipsContainer}>
                      {item.categories.map((catId) => {
                        const categoryObj = (categories.data || []).find(
                          (c) => c.id === catId,
                        );
                        if (!categoryObj) return null;

                        return (
                          <Chip
                            key={catId}
                            compact
                            icon="tag"
                            style={styles.chip}
                            textStyle={styles.chipText}
                            onClose={() => toggleCategory(catId, item, i)}
                          >
                            {categoryObj.category}
                          </Chip>
                        );
                      })}
                    </View>
                  </View>
                </View>
              );
            })}

            <View style={styles.buttonContainer}>
              <Button
                icon="plus"
                mode="contained-tonal"
                onPress={addItem}
                contentStyle={styles.buttonContent}
                textColor="white"
                style={styles.button}
              >
                Add Item
              </Button>
            </View>

            <Text>{JSON.stringify(items)}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    minWidth: "100%",
  },
  mainWrapper: {
    // flex: 1,
    minWidth: "100%",
    flexDirection: "column",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  headerSpacer: {
    width: 36,
    marginRight: 0,
  },
  headerGrid: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 4,
  },
  headerTextBase: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#888",
  },
  headerTextCategory: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#888",
    flex: 3,
  },
  headerTextQuantity: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#888",
    flex: 1.5,
  },
  headerTextPrice: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#888",
    flex: 2,
  },
  headerTextTotal: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#888",
    flex: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 0,
    width: "100%",
    color: "white",
  },
  itemRow2: {
    // flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 0,
    width: "100%",
    color: "white",
  },
  iconButtonZeroMargin: {
    margin: 0,
    padding: 0,
  },
  itemGrid: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 4,
  },
  categoriesWrapper: {
    flex: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    marginTop: 5,
    position: "relative",
    width: "100%",
  },
  chip: {
    height: 32,
    alignItems: "center",
    width: "auto",
    // flexWrap: "wrap",
  },
  chipText: {
    fontSize: 13,
  },
  input: {
    backgroundColor: "transparent",
    maxHeight: 30,
    paddingHorizontal: 0,
    fontSize: 14,
    color: "#666",
  },
  flex1: {
    flex: 1,
  },
  flex1_5: {
    flex: 1.5,
  },
  flex2: {
    flex: 2,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  buttonContent: {
    height: 40,
  },
  button: {
    borderRadius: 8,
  },
});
