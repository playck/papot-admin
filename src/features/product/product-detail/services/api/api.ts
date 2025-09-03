import { supabase } from "@/services/supabase/client";
import {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from "@/features/product/types/product";
import { ProductResponseAdapter } from "../../adapter/ProductResponseAdapter";

export const createProduct = async (productData: CreateProductRequest) => {
  try {
    // 1. 상품 정보를 products 테이블에 저장
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        ...productData,
      })
      .select()
      .single();

    if (productError) {
      throw new Error(`상품 생성 실패: ${productError.message}`);
    }

    const productId = product.id;

    // 2. product_images 테이블에도 이미지 메타데이터 저장
    if (productData.image_urls && productData.image_urls.length > 0) {
      const imageInserts = productData.image_urls.map((imageUrl, index) => ({
        product_id: productId,
        image_url: imageUrl,
        display_order: index,
        is_primary: index === 0,
      }));

      const { error: imageError } = await supabase
        .from("product_images")
        .insert(imageInserts);

      if (imageError) {
        // 실패 시 생성된 상품도 삭제
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
    const { id, ...productInfo } = productData;

    // 1. 상품 정보 업데이트 (image_urls 포함)
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

    // 2. product_images 테이블도 업데이트
    if (productData.image_urls) {
      await updateProductImages(id, productData.image_urls);
    }

    return product;
  } catch (error) {
    console.error("상품 업데이트 중 오류:", error);
    throw error;
  }
};

// product_images 테이블 업데이트 함수
const updateProductImages = async (
  productId: string,
  newImageUrls: string[]
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

    // 2. 삭제할 이미지 찾기
    const imagesToDelete =
      existingImages?.filter((img) => !newImageUrls.includes(img.image_url)) ||
      [];

    // 3. 추가할 이미지 찾기
    const imagesToAdd = newImageUrls.filter(
      (url) => !existingUrls.includes(url)
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

    // 5. 새 이미지 추가
    if (imagesToAdd.length > 0) {
      const imageInserts = imagesToAdd.map((imageUrl) => {
        const targetIndex = newImageUrls.findIndex((url) => url === imageUrl);
        return {
          product_id: productId,
          image_url: imageUrl,
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

    // 6. 기존 이미지 순서 업데이트
    const remainingImages =
      existingImages?.filter((img) => newImageUrls.includes(img.image_url)) ||
      [];

    for (const existingImg of remainingImages) {
      const newIndex = newImageUrls.findIndex(
        (url) => url === existingImg.image_url
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
