import { Product } from "@/types/product";

/**
 * 상품 리스트 응답 데이터를 Product 타입으로 변환하는 어댑터
 */
class ProductListResponseAdapter {
  private rawData: unknown[];

  constructor(rawData: unknown[]) {
    this.rawData = rawData || [];
  }

  /**
   * 단일 상품 데이터 변환
   */
  private adaptSingleProduct(item: any): Product {
    return {
      id: item.id as string,
      name: item.name as string,
      price: item.price as number,
      quantity: item.quantity as number,
      discountRate: item.discount_rate as number,
      isPublished: item.is_published as boolean,
      categoryId: item.category_id as number,
      description: item.description as string,
      createdAt: item.created_at as string,
      updatedAt: item.updated_at as string,
      uploadedBy: item.uploaded_by as string,
      images: this.adaptProductImages(item.product_images || [], item.id),
      category: this.adaptCategory(item.categories),
    };
  }

  /**
   * 상품 이미지 배열 변환
   */
  private adaptProductImages(images: any[], productId: string) {
    return images
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => ({
        id: img.id as string,
        productId: productId,
        imageUrl: img.image_url as string,
        displayOrder: img.display_order as number,
        isPrimary: img.is_primary as boolean,
        createdAt: img.created_at as string,
      }));
  }

  /**
   * 카테고리 데이터 변환
   */
  private adaptCategory(categoryData: any) {
    if (!categoryData) return undefined;

    return {
      id: categoryData.id as number,
      name: categoryData.name as string,
      createdAt: categoryData.created_at as string,
      ...(categoryData.updated_at && {
        updatedAt: categoryData.updated_at as string,
      }),
    };
  }

  /**
   * 전체 상품 목록 변환
   */
  adapt(): Product[] {
    return this.rawData.map((item) => this.adaptSingleProduct(item));
  }
}

export default ProductListResponseAdapter;
