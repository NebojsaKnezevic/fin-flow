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
  isValid: boolean;
  setExpense: (e: InsertExpenseExtended) => void;
  addExpenseItem: (ei: InsertExpenseItemExtended) => void;
  removeExpenseItem: (index: number) => void;
  updateExpenseItem: (index: number, item: InsertExpenseItemExtended) => void;
  setValid: (x: boolean) => void;

  aiTextInput: string;
  setAiTextInput: (s: string) => void;
  isLoading: boolean;
  setIsLoading: (b: boolean) => void;

  imageBase64: { img: string; isSelected: boolean }[];
  setImage64: (bi64: string) => void;
  removeImage64: (i: number) => void;
  selectImage64: (i: number) => void;
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

export const useExpenseStore = create<ExpenseState>((set) => ({
  expense: defaultExpense,
  isValid: false,

  setExpense: (e: InsertExpenseExtended) => set({ expense: e }),

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

  imageBase64: [],
  setImage64: (bi64: string) =>
    set((state) => ({
      imageBase64: [...state.imageBase64, { img: bi64, isSelected: true }],
    })),

  removeImage64: (i: number) =>
    set((state) => ({
      imageBase64: state.imageBase64.filter((_, index) => index !== i),
    })),

  selectImage64: (i: number) =>
    set((state) => ({
      imageBase64: state.imageBase64.map((img, index) => {
        if (i === index) return { ...img, isSelected: !img.isSelected };
        return img;
      }),
    })),
}));
