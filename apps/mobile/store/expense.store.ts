import {
  InsertExpense,
  InsertExpenseItem,
  InsertExpenseCategory,
} from "@api/schema";
import { create } from "zustand";

export type ExpenseItemObj = InsertExpenseItem & {
  categories: number[];
};

interface ExpenseState {
  expense: InsertExpense;
  expenseItems: ExpenseItemObj[];
  setExpanse: (e: InsertExpense) => void;
  addExpenseItem: (ei: ExpenseItemObj) => void;
  removeExpenseItem: (index: number) => void;
  updateExpenseItem: (index: number, item: ExpenseItemObj) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => {
  return {
    expense: {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      userId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      source: "basic",
      note: "",
      occuredAt: new Date("2026-06-29T19:15:00.000Z"),
    },
    expenseItems: [],

    setExpanse: (e: InsertExpense) => set({ expense: e }),

    addExpenseItem: (ei: ExpenseItemObj) =>
      set((state) => ({ expenseItems: [...state.expenseItems, ei] })),

    removeExpenseItem: (index: number) =>
      set((s) => ({
        expenseItems: s.expenseItems.filter((_, i) => index !== i),
      })),

    updateExpenseItem: (index: number, item: ExpenseItemObj) =>
      set((s) => {
        s.expenseItems[index] = item;
        return {
          expenseItems: [...s.expenseItems],
        };
      }),
  };
});
