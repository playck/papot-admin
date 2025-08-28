import { CreateProductRequest } from "@/types/product";
import { ProductDetailFormData } from "../hooks/useProductDetailForm";

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

  adapt(): CreateProductRequest {
    if (!this.categoryId) {
      throw new Error(
        "categoryId는 필수 값입니다. ProductFormAdapter 생성 시 categoryId를 제공해주세요."
      );
    }

    return {
      name: this.formData.name.trim(),
      description: this.formData.description.trim(),
      price: this.convertPrice(this.formData.price),
      discount_rate: this.convertDiscountRate(this.formData.discountRate),
      quantity: Math.floor(this.formData.quantity),
      is_published: this.formData.isPublished,
      category_id: this.categoryId,
      images: this.formData.images.map((image) => ({
        url: image,
      })),
      badges: this.convertBadges(this.formData.badges),
      uploaded_by: this.userId,
    };
  }
}
