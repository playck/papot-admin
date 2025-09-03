import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const productDetailSchema = z.object({
  // 상품 이름
  name: z
    .string()
    .min(1, "상품 이름을 입력해주세요")
    .max(100, "상품 이름은 100자 이하로 입력해주세요"),

  // 상품 카테고리
  categoryId: z.number().min(1, "카테고리를 선택해주세요"),

  // 상품 이미지 (여러개 가능)
  images: z
    .array(z.string().url("올바른 이미지 URL을 입력해주세요"))
    .min(1, "최소 1개의 이미지를 등록해주세요")
    .max(10, "이미지는 최대 10개까지 등록 가능합니다"),

  // 상품 게시 상태 (Boolean)
  isPublished: z.boolean(),

  // 상품 간단 설명
  description: z
    .string()
    .min(10, "상품 설명은 최소 10자 이상 입력해주세요")
    .max(500, "상품 설명은 500자 이하로 입력해주세요"),

  // 상품 수량
  quantity: z
    .number()
    .int("수량은 정수로 입력해주세요")
    .min(0, "수량은 0 이상이어야 합니다")
    .max(999, "수량은 999개 이하로 입력해주세요"),

  // 상품 뱃지 (여러개 가능)
  badges: z
    .array(z.string().min(1, "뱃지 이름을 입력해주세요"))
    .max(5, "뱃지는 최대 5개까지 등록 가능합니다"),

  // 상품 가격
  price: z
    .number()
    .min(0, "가격은 0원 이상이어야 합니다")
    .max(10000000, "가격은 1,000만원 이하로 입력해주세요"),

  // 상품 할인률 (0-100%)
  discountRate: z
    .number()
    .min(0, "할인률은 0% 이상이어야 합니다")
    .max(100, "할인률은 100% 이하여야 합니다"),

  // 상품 상세 설명 (에디터)
  detailDescription: z
    .string()
    .min(1, "상품 상세 설명을 입력해주세요")
    .optional(),
});

export type ProductDetailFormData = z.infer<typeof productDetailSchema>;

const defaultValues: ProductDetailFormData = {
  name: "",
  categoryId: 1,
  images: [],
  isPublished: false,
  description: "",
  quantity: 0,
  badges: [],
  price: 0,
  discountRate: 0,
  detailDescription: "",
};

export function useProductDetailForm(
  initialData?: Partial<ProductDetailFormData>
) {
  const form = useForm<ProductDetailFormData>({
    resolver: zodResolver(productDetailSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
    },
    mode: "onChange",
  });

  const updateField = (
    field: keyof ProductDetailFormData,
    value: ProductDetailFormData[keyof ProductDetailFormData]
  ) => {
    form.setValue(field, value, { shouldValidate: true });
  };

  return {
    methods: form,
    updateField,
    formState: form.formState,
    handleSubmit: form.handleSubmit,
  };
}
