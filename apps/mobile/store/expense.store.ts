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
  isValid: boolean;
  setExpanse: (e: InsertExpense) => void;
  addExpenseItem: (ei: ExpenseItemObj) => void;
  removeExpenseItem: (index: number) => void;
  updateExpenseItem: (index: number, item: ExpenseItemObj) => void;
  setValid: (x: boolean) => void;

  aiTextInput: string;
  setAiTextInput: (s: string) => void;
  isLoading: boolean;
  setIsLoading: (b: boolean) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => {
  return {
    expense: {
      // id: "",
      userId: "",

      source: "basic",
      isValid: false,
      note: "",
      occuredAt: new Date(),
    },
    expenseItems: [],
    isValid: false,

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

    setValid: (x: boolean) => set({ isValid: x }),

    aiTextInput: "",
    setAiTextInput: (s: string) => set({ aiTextInput: s }),
    isLoading: false,
    setIsLoading: (b: boolean) => set({ isLoading: b }),
  };
});
