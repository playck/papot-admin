import { supabase } from "@/services/supabase/client";
import {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from "@/features/product/types/product";
import { ProductResponseAdapter } from "../../adapter/ProductResponseAdapter";

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

export const getProductById = async (productId: string): Promise<Product> => {
  try {
    // 상품 기본 정보와 카테고리 정보를 함께 조회
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          created_at
        )
      `
      )
      .eq("id", productId)
      .single();

    if (productError) {
      throw new Error(`상품 조회 실패: ${productError.message}`);
    }

    if (!product) {
      throw new Error("상품을 찾을 수 없습니다.");
    }

    // 상품 이미지 조회
    const { data: images, error: imageError } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (imageError) {
      throw new Error(`상품 이미지 조회 실패: ${imageError.message}`);
    }

    const fetchedProduct = ProductResponseAdapter.adapt(product, images);

    return fetchedProduct;
  } catch (error) {
    console.error("상품 조회 중 오류:", error);
    throw error;
  }
};

export const updateProduct = async (productData: UpdateProductRequest) => {
  try {
    const { id, images, ...productInfo } = productData;

    // 1. 상품 기본 정보 업데이트
    const { data: product, error: productError } = await supabase
      .from("products")
      .update({
        ...productInfo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (productError) {
      throw new Error(`상품 업데이트 실패: ${productError.message}`);
    }

    // 2. 이미지 업데이트
    if (images && images.length > 0) {
      await updateProductImages(id, images);
    }

    return product;
  } catch (error) {
    console.error("상품 업데이트 중 오류:", error);
    throw error;
  }
};

// 이미지 리스트 업데이트 함수
const updateProductImages = async (
  productId: string,
  newImages: { url: string }[]
) => {
  try {
    // 1. 기존 이미지 조회
    const { data: existingImages, error: fetchError } = await supabase
      .from("product_images")
      .select("id, image_url, display_order, is_primary")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (fetchError) {
      throw new Error(`기존 이미지 조회 실패: ${fetchError.message}`);
    }

    const existingUrls = existingImages?.map((img) => img.image_url) || [];
    const newUrls = newImages.map((img) => img.url);

    // 2. 삭제할 이미지 찾기
    const imagesToDelete =
      existingImages?.filter((img) => !newUrls.includes(img.image_url)) || [];

    // 3. 추가할 이미지 찾기
    const imagesToAdd = newImages.filter(
      (img) => !existingUrls.includes(img.url)
    );

    // 4. 삭제 실행
    if (imagesToDelete.length > 0) {
      const deleteIds = imagesToDelete.map((img) => img.id);
      const { error: deleteError } = await supabase
        .from("product_images")
        .delete()
        .in("id", deleteIds);

      if (deleteError) {
        throw new Error(`이미지 삭제 실패: ${deleteError.message}`);
      }
    }

    // 5. 새 이미지 추가 (올바른 순서로)
    if (imagesToAdd.length > 0) {
      const imageInserts = imagesToAdd.map((imageData) => {
        const targetIndex = newImages.findIndex(
          (img) => img.url === imageData.url
        );

        return {
          product_id: productId,
          image_url: imageData.url,
          display_order: targetIndex,
          is_primary: targetIndex === 0,
        };
      });

      const { error: insertError } = await supabase
        .from("product_images")
        .insert(imageInserts);

      if (insertError) {
        throw new Error(`이미지 추가 실패: ${insertError.message}`);
      }
    }

    // 6. 기존 이미지 순서 업데이트 (순서가 변경된 것만)
    const remainingImages =
      existingImages?.filter((img) => newUrls.includes(img.image_url)) || [];

    for (const existingImg of remainingImages) {
      const newIndex = newImages.findIndex(
        (img) => img.url === existingImg.image_url
      );

      const needsUpdate =
        existingImg.display_order !== newIndex ||
        (newIndex === 0 && !existingImg.is_primary) ||
        (newIndex !== 0 && existingImg.is_primary);

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from("product_images")
          .update({
            display_order: newIndex,
            is_primary: newIndex === 0,
          })
          .eq("id", existingImg.id);

        if (updateError) {
          console.warn(`이미지 순서 업데이트 실패: ${updateError.message}`);
        }
      }
    }
  } catch (error) {
    console.error("이미지 업데이트 중 오류:", error);
    throw error;
  }
};
