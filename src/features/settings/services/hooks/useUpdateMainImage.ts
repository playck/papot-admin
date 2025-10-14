import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMainImage } from "../../services/api/api";

export const useUpdateMainImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      settingsId,
      imageUrl,
    }: {
      settingsId: string;
      imageUrl: string | null;
    }) => {
      return updateMainImage(settingsId, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
