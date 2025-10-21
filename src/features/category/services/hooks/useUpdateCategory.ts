import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../api/api";
import { UpdateCategoryRequest } from "../../types/category";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
