import { ExpenseCategory } from "@api/schema";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../client/client";

export const categoryKeys = {
  all: ["categories"] as const,
};

export const useCategories = () => {
  return useQuery<ExpenseCategory[], Error>({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<ExpenseCategory[]>(
        "expenses/categories",
      );
      return response.data;
    },
    staleTime: Infinity,
  });
};
