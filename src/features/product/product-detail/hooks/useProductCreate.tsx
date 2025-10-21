import { useRouter } from "next/navigation";
import { useToast } from "@/providers/toast-provider";
import { useCreateProduct } from "../services/useCreateProduct";
import { useUpdateProduct } from "../services/useUpdateProduct";
import { useEditorImageManager } from "./useEditorImageManager";
import { ProductDetailFormData } from "./useProductDetailForm";

interface UseProductCreateProps {
  isEditMode: boolean;
  productId?: string;
  userId?: string;
  onFormReset?: () => void;
}

export function useProductCreate({
  isEditMode,
  productId,
  userId,
  onFormReset,
}: UseProductCreateProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { uploadBase64ImagesToStorage } = useEditorImageManager();
  const { mutate: createProductMutation, isPending: isCreating } =
    useCreateProduct();
  const { mutate: updateProductMutation, isPending: isUpdating } =
    useUpdateProduct();

  const isPending = isCreating || isUpdating;

  const handleProductSubmit = async (data: ProductDetailFormData) => {
    try {
      // 에디터 내 base64 이미지를 스토리지에 업로드
      const processedDescription = await uploadBase64ImagesToStorage(
        data.detailDescription || ""
      );

      const processedData = {
        ...data,
        detailDescription: processedDescription,
      };

      const successCallback = async () => {
        showSuccess(
          isEditMode ? "상품 수정 완료!" : "상품 등록 완료!",
          isEditMode
            ? "상품이 성공적으로 수정되었습니다."
            : "상품이 성공적으로 등록되었습니다."
        );

        if (!isEditMode && onFormReset) {
          onFormReset();
        }

        setTimeout(() => {
          router.push("/product/list");
        }, 1500);
      };

      const errorCallback = (error: Error) => {
        showError(
          isEditMode ? "상품 수정 실패" : "상품 등록 실패",
          error.message ||
            (isEditMode
              ? "상품 수정 중 오류가 발생했습니다."
              : "상품 등록 중 오류가 발생했습니다.")
        );
      };

      if (isEditMode && productId) {
        updateProductMutation(
          {
            productId,
            productData: processedData,
            categoryId: processedData.categoryId,
          },
          {
            onSuccess: successCallback,
            onError: errorCallback,
          }
        );
      } else {
        createProductMutation(
          {
            productData: processedData,
            categoryId: processedData.categoryId,
            userId,
          },
          {
            onSuccess: successCallback,
            onError: errorCallback,
          }
        );
      }
    } catch (error) {
      console.error("폼 제출 중 오류:", error);
      showError("처리 중 오류 발생", "요청 처리 중 오류가 발생했습니다.");
    }
  };

  return {
    handleProductSubmit,
    isPending,
  };
}
