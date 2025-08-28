import { useMutation } from "@tanstack/react-query";
import { createProduct } from "./api/api";
import ProductFormAdapter from "../adapter/ProductFormAdapter";
import { ProductDetailFormData } from "../hooks/useProductDetailForm";

interface CreateProductParams {
  productData: ProductDetailFormData;
  categoryId: number;
  userId?: string;
}

export const useCreateProduct = () => {
  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: ({ productData, categoryId, userId }: CreateProductParams) => {
      const data = new ProductFormAdapter(
        productData,
        categoryId,
        userId
      ).adapt();
      return createProduct(data);
    },
    onSuccess: (data) => {
      console.log("상품이 성공적으로 생성되었습니다:", data);
    },
    onError: (error) => {
      console.error("상품 생성 실패:", error);
    },
  });
};
