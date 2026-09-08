import { InsertExpenseItem } from ".";

export type ExpenseItemObj = InsertExpenseItem & {
  categories: number[];
};
