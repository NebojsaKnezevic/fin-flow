import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ExpenseItems from "./expense-item.input";
import { useExpenseStore } from "../../../../store/expense.store";
import { InsertExpense } from "@api/schema";
import { Text, TextInput, useTheme } from "react-native-paper";
import CustomInputField from "./custom-field.input";
import { AppTheme } from "@/app/_layout";

export default function Expense() {
  const theme: AppTheme = useTheme();
  const newExpense: InsertExpense = useExpenseStore((s) => s.expense);
  const setNewExpense = useExpenseStore((s) => s.setExpanse);

  const items = useExpenseStore((s) => s.expenseItems);

  React.useEffect(() => {
    const total = items.reduce((acc, current) => {
      const price = Number(current.price) || 0;
      const quantity = Number(current.quantity) || 0;
      return acc + price * quantity;
    }, 0);

    setNewExpense({ ...newExpense, totalAmount: total });
  }, [items]);
  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.centerContent}
    >
      {/* <Text>{JSON.stringify(newExpense)}</Text> */}
      {/* <Text>{JSON.stringify(newExpense.)}</Text> */}
      <CustomInputField
        label="Receipt Name:"
        val={newExpense.name}
        setValue={(val) => setNewExpense({ ...newExpense, name: val })}
      />
      <CustomInputField
        label="Merchant:"
        val={newExpense.merchant}
        setValue={(val) => setNewExpense({ ...newExpense, merchant: val })}
      />
      <CustomInputField
        label="Note:"
        val={newExpense.note}
        setValue={(val) => setNewExpense({ ...newExpense, note: val })}
      />
      <CustomInputField
        label="Occured At:"
        val={newExpense.occuredAt.toLocaleDateString()}
      />

      <ExpenseItems
        setTotalAmount={(val: number) =>
          setNewExpense({ ...newExpense, totalAmount: val })
        }
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 4,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <CustomInputField
            customLabel={false}
            label="Total:"
            val={newExpense.totalAmount}
          />
        </View>

        <View style={{ flex: 1 }}>
          <CustomInputField
            customLabel={false}
            label="Currency:"
            val={newExpense.currency}
            setValue={(val) => setNewExpense({ ...newExpense, currency: val })}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:
    // backgroundColor:  theme ,
  },
  centerContent: {
    padding: 0,
    // alignItems: "center",
  },

  receiptPaper: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 12,
    paddingVertical: 24,
    borderRadius: 2,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  invisibleInput: {
    backgroundColor: "transparent",
    height: 30,
    paddingHorizontal: 0,
    margin: 0,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  merchantText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
    width: "80%",
    height: 40,
  },
  receiptSubtext: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    marginTop: 2,
  },
  dashedDivider: {
    backgroundColor: "transparent",
    borderStyle: "dashed",
    borderWidth: 0.5,
    borderColor: "#999",
    marginVertical: 12,
  },
  itemsContainer: {
    marginVertical: 8,
  },
  receiptRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  inlineDeleteBtn: {
    margin: 0,
    padding: 0,
    width: 24,
  },
  receiptRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNameInput: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: "500",
  },
  priceContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  quantityInput: {
    width: 25,
    textAlign: "left",
    fontSize: 14,
    color: "#666",
  },
  xText: {
    fontSize: 12,
    color: "#888",
    marginHorizontal: 4,
  },
  priceInput: {
    width: 65,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },
  addRowContainer: {
    alignItems: "flex-start",
    marginLeft: 24, // Da se poravna sa tekstom zbog delete ikonice
    marginTop: 8,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  totalInput: {
    width: 100,
    textAlign: "right",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    width: "100%",
    maxWidth: 400,
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 4,
  },
});
