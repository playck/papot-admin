import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { getProductList, ProductListParams } from "../api/api";

export const useProductList = (params: ProductListParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProductList(params),
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useProductSearch = (searchTerm: string, delay: number = 500) => {
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, delay);

  return useProductList({
    search: debouncedSearchTerm,
    limit: 50,
  });
};
