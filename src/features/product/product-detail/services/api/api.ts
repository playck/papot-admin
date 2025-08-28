import { supabase } from "@/services/supabase/client";
import { CreateProductRequest } from "@/features/product/types/product";

export const createProduct = async (productData: CreateProductRequest) => {
  try {
    // 1. 상품 기본 정보만 추출 (이미지 제외)
    const { images, ...productInfo } = productData;

    // 2. products 테이블에 기본 상품 정보 삽입
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        ...productInfo,
        uploaded_by: productData.uploaded_by,
      })
      .select()
      .single();

    if (productError) {
      throw new Error(`상품 생성 실패: ${productError.message}`);
    }

    const productId = product.id;

    // 3. 이미지 메타데이터를 product_images 테이블에 삽입
    if (images && images.length > 0) {
      const imageInserts = images.map((imageData, index) => ({
        product_id: productId,
        image_url: imageData.url,
        display_order: index,
        is_primary: index === 0,
      }));

      const { error: imageError } = await supabase
        .from("product_images")
        .insert(imageInserts);

      if (imageError) {
        await supabase.from("products").delete().eq("id", productId);
        throw new Error(`이미지 정보 저장 실패: ${imageError.message}`);
      }
    }

    return product;
  } catch (error) {
    console.error("상품 생성 중 오류:", error);
    throw error;
  }
};
