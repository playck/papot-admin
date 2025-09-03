import { CreateProductRequest } from "@/features/product/types/product";
import { ProductDetailFormData } from "../hooks/useProductDetailForm";

interface UpdateProductRequest
  extends Omit<CreateProductRequest, "uploaded_by"> {
  id: string;
}

export default class ProductFormAdapter {
  private formData: ProductDetailFormData;
  private categoryId?: number;
  private userId?: string;

  constructor(
    formData: ProductDetailFormData,
    categoryId?: number,
    userId?: string
  ) {
    this.formData = formData;
    this.categoryId = categoryId;
    this.userId = userId;
  }

  private convertBadges(badges: string[]): string[] {
    return badges
      .filter((badge) => badge.trim() !== "")
      .map((badge) => badge.trim());
  }

  private convertPrice(price: number): number {
    return Math.floor(price);
  }

  private convertDiscountRate(discountRate: number): number {
    return Math.floor(Math.max(0, Math.min(100, discountRate)));
  }

  adaptForCreate(): CreateProductRequest {
    if (!this.categoryId) {
      throw new Error(
        "categoryId는 필수 값입니다. ProductFormAdapter 생성 시 categoryId를 제공해주세요."
      );
    }

    return {
      name: this.formData.name.trim(),
      description: this.formData.description.trim(),
      detail_description: this.formData.detailDescription?.trim() || "",
      price: this.convertPrice(this.formData.price),
      discount_rate: this.convertDiscountRate(this.formData.discountRate),
      quantity: Math.floor(this.formData.quantity),
      is_published: this.formData.isPublished,
      category_id: this.categoryId,
      image_urls: this.formData.images,
      badges: this.convertBadges(this.formData.badges),
      uploaded_by: this.userId,
    };
  }

  adaptForUpdate(productId: string): UpdateProductRequest {
    if (!this.categoryId) {
      throw new Error(
        "categoryId는 필수 값입니다. ProductFormAdapter 생성 시 categoryId를 제공해주세요."
      );
    }

    return {
      id: productId,
      name: this.formData.name.trim(),
      description: this.formData.description.trim(),
      detail_description: this.formData.detailDescription?.trim() || "",
      price: this.convertPrice(this.formData.price),
      discount_rate: this.convertDiscountRate(this.formData.discountRate),
      quantity: Math.floor(this.formData.quantity),
      is_published: this.formData.isPublished,
      category_id: this.categoryId,
      image_urls: this.formData.images,
      badges: this.convertBadges(this.formData.badges),
    };
  }
}
