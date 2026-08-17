import {
  InsertExpense,
  InsertExpenseItemExtended,
  insertExpenseExtendedSchema,
  InsertExpenseExtended,
  getJsonSchema,
  insertExpenseItemExtendedSchema,
} from "@repo/models";
import { create } from "zustand";

interface ExpenseState {
  expense: InsertExpenseExtended;
  // expenseItems: InsertExpenseItemExtended[];
  isValid: boolean;
  setExpanse: (e: InsertExpenseExtended) => void;
  addExpenseItem: (ei: InsertExpenseItemExtended) => void;
  removeExpenseItem: (index: number) => void;
  updateExpenseItem: (index: number, item: InsertExpenseItemExtended) => void;
  setValid: (x: boolean) => void;

  aiTextInput: string;
  setAiTextInput: (s: string) => void;
  isLoading: boolean;
  setIsLoading: (b: boolean) => void;
}

export const defaultExpense: InsertExpenseExtended = {
  userId: "",
  source: "basic",
  occuredAt: new Date(),
  totalAmount: 0,
  currency: "USD",
  merchant: "",
  name: "",
  note: "",
  expenseItemList: [
    {
      price: "0",
      quantity: "1",
      categories: [],
      newCategory: null,
    },
  ],
};

export const useExpenseStore = create<ExpenseState>((set) => {
  return {
    expense: defaultExpense,
    // expenseItems: [],
    isValid: false,

    setExpanse: (e: InsertExpenseExtended) => set({ expense: e }),

    addExpenseItem: (ei: InsertExpenseItemExtended) =>
      set((state) => ({
        expense: {
          ...state.expense,
          expenseItemList: [...state.expense.expenseItemList, ei],
        },
      })),

    removeExpenseItem: (index: number) =>
      set((state) => ({
        expense: {
          ...state.expense,
          expenseItemList: state.expense.expenseItemList.filter(
            (_, i) => i !== index,
          ),
        },
      })),

    updateExpenseItem: (index: number, item: InsertExpenseItemExtended) =>
      set((state) => ({
        expense: {
          ...state.expense,
          expenseItemList: state.expense.expenseItemList.map((oldItem, i) =>
            i === index ? item : oldItem,
          ),
        },
      })),

    setValid: (x: boolean) => set({ isValid: x }),

    aiTextInput: "",
    setAiTextInput: (s: string) => set({ aiTextInput: s }),
    isLoading: false,
    setIsLoading: (b: boolean) => set({ isLoading: b }),
  };
});
