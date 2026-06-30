import { InsertExpense, InsertExpenseItem } from "@api/schema";
import { create } from "zustand";

interface ExpenseState {
  expense: InsertExpense;
  expenseItems: InsertExpenseItem[];
  setExpanse: (e: InsertExpense) => void;
  addExpenseItem: (ei: InsertExpenseItem) => void;
  removeExpenseItem: (index: number) => void;
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

    addExpenseItem: (ei: InsertExpenseItem) =>
      set((state) => ({ expenseItems: [...state.expenseItems, ei] })),

    removeExpenseItem: (index: number) =>
      set((s) => ({
        expenseItems: s.expenseItems.filter((_, i) => index !== i),
      })),
  };
});
