import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../client/client";
import { InsertExpense, InsertExpenseExtended } from "@repo/models";
// import { ExpenseItemObj } from "../../store/expense.store";
import { Notify } from "../../helpers/toast.helper";
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

interface CreateExpenseAiPayload {
  prompt?: string;
  imageBase64: string[];
  isMultiple: boolean;
}

export const useCreateExpenseAI = () => {
  return useMutation({
    mutationFn: async ({
      prompt,
      imageBase64,
      isMultiple,
    }: CreateExpenseAiPayload) => {
      const res = await apiClient.post("/expenses/createExpenseAI", {
        prompt: prompt,
        image: imageBase64,
        isMultiple: isMultiple,
      });
      return res.data;
    },
    onError: (error) => {
      console.error("Error during expense AI creation: ", error);
      Notify.error("Failed to generate expense via AI");
    },
  });
};
