import {
  Product,
  ProductImage,
  Category,
} from "@/features/product/types/product";

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  detail_description?: string;
  price: number;
  discount_rate?: number;
  quantity: number;
  is_published: boolean;
  category_id: number;
  image_urls?: string[];
  badges: string[];
  created_at: string;
  updated_at: string;
  uploaded_by?: string;
  categories?: {
    id: number;
    name: string;
    created_at: string;
  };
}

interface ImageResponse {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

/**
 * 상품 조회 응답 데이터를 Product 타입으로 변환하는 어댑터
 */
export class ProductResponseAdapter {
  /**
   * 상품 조회 응답 데이터를 Product 타입으로 변환
   */
  static adapt(
    productResponse: ProductResponse,
    imagesResponse?: ImageResponse[]
  ): Product {
    return {
      id: productResponse.id,
      name: productResponse.name,
      description: productResponse.description,
      detailDescription: productResponse.detail_description || "",
      price: productResponse.price,
      discountRate: productResponse.discount_rate || 0,
      quantity: productResponse.quantity,
      isPublished: productResponse.is_published,
      categoryId: productResponse.category_id,
      category: productResponse.categories
        ? this.toCategoryFromDatabase(productResponse.categories)
        : undefined,
      images: imagesResponse ? this.toProductImages(imagesResponse) : [],
      image_urls: productResponse.image_urls || [], // image_urls 필드 매핑
      badges: productResponse.badges || [],
      createdAt: productResponse.created_at,
      updatedAt: productResponse.updated_at,
      uploadedBy: productResponse.uploaded_by,
    };
  }

  /**
   * 카테고리 응답을 Category 타입으로 변환
   */
  private static toCategoryFromDatabase(categoryResponse: {
    id: number;
    name: string;
    created_at: string;
  }): Category {
    return {
      id: categoryResponse.id,
      name: categoryResponse.name,
      createdAt: categoryResponse.created_at,
    };
  }

  /**
   * 이미지 응답 배열을 ProductImage 배열로 변환
   */
  private static toProductImages(
    imagesResponse: ImageResponse[]
  ): ProductImage[] {
    return imagesResponse.map((img) => ({
      id: img.id,
      productId: img.product_id,
      imageUrl: img.image_url,
      displayOrder: img.display_order,
      isPrimary: img.is_primary,
      createdAt: img.created_at,
    }));
  }

  /**
   * 단일 이미지 응답을 ProductImage로 변환
   */
  static toProductImage(imageResponse: ImageResponse): ProductImage {
    return {
      id: imageResponse.id,
      productId: imageResponse.product_id,
      imageUrl: imageResponse.image_url,
      displayOrder: imageResponse.display_order,
      isPrimary: imageResponse.is_primary,
      createdAt: imageResponse.created_at,
    };
  }
}
