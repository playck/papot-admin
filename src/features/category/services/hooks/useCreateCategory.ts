import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/api";
import { CreateCategoryRequest } from "../../types/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
