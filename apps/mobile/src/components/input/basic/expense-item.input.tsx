import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
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
  Menu,
} from "react-native-paper";
import { AppTheme } from "@/app/_layout";
import { useExpenseStore } from "../../../../store/expense.store";

const CATEGORIES = [
  "Hrana",
  "Prevoz",
  "Računi",
  "Zabava",
  "Higijena",
  "Tehnika",
  "dasdsafdsfawtaewtfsefsfdsfd",
];

interface IProps {
  setTotalAmount: (val: number) => void;
}

export default function ExpenseItems({ setTotalAmount }: IProps) {
  const theme = useTheme() as AppTheme;

  const items = useExpenseStore((s) => s.expenseItems);
  const addItemInStore = useExpenseStore((s) => s.addExpenseItem);
  const updateItemInStore = useExpenseStore((s) => s.updateExpenseItem);
  const removeItemFromStore = useExpenseStore((s) => s.removeExpenseItem);

  const [visibleMenuIndex, setVisibleMenuIndex] = useState<number | null>(null);

  const openMenu = (index: number) => setVisibleMenuIndex(index);
  const closeMenu = () => setVisibleMenuIndex(null);

  const addItem = () => {
    addItemInStore({
      price: 0,
      quantity: 1,
      categoryId: 0,
    });
  };

  const dynamicBackground = { backgroundColor: theme.colors.background };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, dynamicBackground]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
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

              const currentCategoryName =
                CATEGORIES[item.categoryId ?? 0] || "Izaberi";

              return (
                <View key={i} style={[styles.itemRow, dynamicBackground]}>
                  {/* <IconButton
                    icon="bin-outline"
                    iconColor="red"
                    size={16}
                    style={styles.iconButtonZeroMargin}
                    onPress={() => removeItemFromStore(i)}
                  /> */}

                  <View style={styles.itemGrid}>
                    <View style={styles.categoriesWrapper}>
                      <Chip
                        compact
                        icon="tag"
                        style={styles.chip}
                        textStyle={styles.chipText}
                      >
                        {currentCategoryName}
                      </Chip>

                      <Menu
                        visible={isMenuOpen}
                        onDismiss={closeMenu}
                        anchor={
                          <IconButton
                            icon="plus-circle"
                            size={20}
                            iconColor={theme.colors.primary}
                            style={styles.iconButtonZeroMargin}
                            onPress={() => openMenu(i)}
                          />
                        }
                      >
                        {CATEGORIES.map((cat, catIdx) => (
                          <Menu.Item
                            key={catIdx}
                            onPress={() => {
                              updateItemInStore(i, {
                                ...item,
                                categoryId: catIdx,
                              });
                              closeMenu();
                            }}
                            title={cat}
                          />
                        ))}
                      </Menu>
                    </View>

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
              );
            })}

            <View style={styles.buttonContainer}>
              <Button
                icon="plus"
                mode="contained-tonal"
                onPress={addItem}
                contentStyle={styles.buttonContent}
                style={styles.button}
              >
                Add Item
              </Button>
            </View>
            {/* <Text>{JSON.stringify(items)}</Text> */}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    width: "100%",
  },
  mainWrapper: {
    flex: 1,
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
    flex: 5,
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
    paddingVertical: 6,
    width: "100%",
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
  chip: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 110,
  },
  chipText: {
    fontSize: 11,
    marginVertical: 0,
    // numberOfLines: 1,
    // ellipsizeMode: "tail",
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
