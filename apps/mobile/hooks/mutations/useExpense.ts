import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../client/client";
import { InsertExpense, InsertExpenseExtended } from "@api/schema";
import { ExpenseItemObj } from "../../store/expense.store";
// import { expenseApi } from '../../api/expense.api';

// interface InterfaceTest extends InsertExpense {
//   expenseItemList: ExpenseItemObj[];
// }

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newExpense: InsertExpenseExtended) =>
      apiClient.post("/expenses/createExpense", newExpense),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) => {
      console.error("Error during expense creation: ", error);
    },
  });
};
