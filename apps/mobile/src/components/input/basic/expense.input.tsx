import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ExpenseItems from "./expense-items/expense-item.input";
import {
  // ExpenseItemObj,
  useExpenseStore,
} from "../../../../store/expense.store";
import {
  InsertExpense,
  InsertExpenseExtended,
  InsertExpenseItemExtended,
} from "@repo/models";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import CustomInputField from "./custom-field/custom-field.input";
import { AppTheme } from "@/app/_layout";
// import { QuickDatePicker } from "./custom-field/custom-date.input";
import { Notify } from "../../../../helpers/toast.helper";
import { useCreateExpense } from "../../../../hooks/mutations/useExpense";

export default function Expense() {
  const theme: AppTheme = useTheme();
  const newExpense: InsertExpenseExtended = useExpenseStore((s) => s.expense);
  const setNewExpense = useExpenseStore((s) => s.setExpanse);
  const expenseItems: InsertExpenseItemExtended[] = useExpenseStore(
    (s) => s.expense.expenseItemList,
  );

  const { mutate, isPending } = useCreateExpense();

  const items = useExpenseStore((s) => s.expense.expenseItemList);
  const isValid = useExpenseStore((s) => s.isValid);

  React.useEffect(() => {
    const total = items.reduce((acc, current) => {
      const price = Number(current.price) || 0;
      const quantity = Number(current.quantity) || 0;
      return acc + price * quantity;
    }, 0);

    setNewExpense({ ...newExpense, totalAmount: total });
  }, [items]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.centerContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* <Text>{JSON.stringify(newExpense)}</Text> */}

        <CustomInputField
          label="Receipt Name:"
          val={newExpense.name}
          setValue={(val) => setNewExpense({ ...newExpense, name: val })}
        />
        {/* TO DO - Make this a dropdown */}
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
        {/* <CustomInputField
          label="Occured At:"
          val={newExpense.occuredAt.toLocaleDateString("US")}
        /> */}

        {/* TO DO - More love to this one */}
        <CustomInputField
          label="Occured At:"
          val={newExpense.occuredAt.toLocaleDateString()}
          setValue={(val) =>
            setNewExpense({ ...newExpense, occuredAt: new Date(val) })
          }
          validation={(text: string) => {
            const timestamp = Date.parse(text);
            if (isNaN(timestamp)) {
              return [false, "Invalid date"];
            }

            const inputDate = new Date(timestamp);
            const today = new Date();

            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);

            if (inputDate > today) {
              return [false, "Date can't be from future"];
            }

            return [true, ""];
          }}
        />

        {/* <QuickDatePicker /> */}
        {/* TO DO - Definetly more love here */}
        <ExpenseItems />

        <View
          style={{
            flexDirection: "row",
            gap: 16,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 2 }}>
            <CustomInputField
              customLabel={false}
              label="Total: "
              val={newExpense.totalAmount}
            />
          </View>

          <View style={{ flex: 2 }}>
            {/* TO DO - Make this a dropdown */}
            <CustomInputField
              customLabel={false}
              label="Currency: "
              val={newExpense.currency}
              setValue={(val) =>
                setNewExpense({ ...newExpense, currency: val })
              }
            />
          </View>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Button
            disabled={!isValid || isPending}
            loading={isPending}
            mode="contained"
            elevation={2}
            onPress={() =>
              mutate({ ...newExpense, expenseItemList: expenseItems })
            }
            style={styles.submitButton}
            textColor="white"
          >
            SUBMIT
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    minWidth: "100%",
  },
  centerContent: {
    padding: 0,
    paddingBottom: 40,
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
    marginLeft: 24,
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
  submitButton: {
    width: "25%",
    margin: 15,
    flex: 1,
    marginTop: 12,
    // color: "white",
  },
});
