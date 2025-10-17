import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { getOrderList, OrderListParams } from "../api";

export const useOrderList = (params: OrderListParams = {}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrderList(params),
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useOrderSearch = (searchTerm: string, delay: number = 500) => {
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, delay);

  return useOrderList({
    search: debouncedSearchTerm,
    limit: 50,
  });
};
