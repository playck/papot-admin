import { Product } from "@/features/product/types/product";
import { ProductDetailFormData } from "../hooks/useProductDetailForm";

/**
 * 상품 상세 데이터를 폼에서 사용할 수 있는 형태로 변환하는 어댑터
 */
export class ProductDetailAdapter {
  /**
   * Product 데이터를 ProductDetailFormData로 변환
   */
  static toFormData(product: Product): ProductDetailFormData {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      discountRate: product.discountRate,
      quantity: product.quantity,
      isPublished: product.isPublished,
      categoryId: product.categoryId,
      images: product.images.map((img) => img.imageUrl),
      badges: product.badges,
    };
  }

  /**
   * Product 데이터를 부분적으로 폼 데이터로 변환 (초기값용)
   */
  static adapt(product: Product): Partial<ProductDetailFormData> {
    return this.toFormData(product);
  }
}
