import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/api/api";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
};
