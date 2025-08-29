import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/api";
import { Product } from "@/features/product/types/product";

interface UseProductDetailOptions {
  enabled?: boolean;
}

export const useProductDetail = (
  productId: string | undefined,
  options: UseProductDetailOptions = {}
) => {
  return useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => {
      if (!productId) {
        throw new Error("상품 ID가 필요합니다.");
      }
      return getProductById(productId);
    },
    enabled: !!productId && options.enabled !== false,
    gcTime: 10 * 60 * 1000,
  });
};
