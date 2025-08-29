import { useMutation } from "@tanstack/react-query";
import { updateProduct } from "./api/api";
import ProductFormAdapter from "../adapter/ProductFormAdapter";
import { ProductDetailFormData } from "../hooks/useProductDetailForm";

interface UpdateProductParams {
  productId: string;
  productData: ProductDetailFormData;
  categoryId: number;
}

export const useUpdateProduct = () => {
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: ({
      productId,
      productData,
      categoryId,
    }: UpdateProductParams) => {
      const data = new ProductFormAdapter(
        productData,
        categoryId
      ).adaptForUpdate(productId);
      return updateProduct(data);
    },
    onSuccess: (data) => {
      console.log("상품이 성공적으로 업데이트되었습니다:", data);
    },
    onError: (error) => {
      console.error("상품 업데이트 실패:", error);
    },
  });
};
