import { supabase } from "@/services/supabase/client";
import { Product } from "@/features/product/types/product";
import ProductListResponseAdapter from "@/features/product/product-list/adapter/ProductListResponseAdapter";

export interface ProductListResponse {
  products: Product[];
  total: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "all";
  sortBy?: "name" | "price" | "quantity" | "created_at";
  sortOrder?: "asc" | "desc";
}

export const getProductList = async (
  params: ProductListParams = {}
): Promise<ProductListResponse> => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    sortBy = "created_at",
    sortOrder = "desc",
  } = params;

  try {
    let query = supabase.from("products").select(
      `
        id,
        name,
        price,
        quantity,
        discount_rate,
        is_published,
        category_id,
        description,
        created_at,
        updated_at,
        uploaded_by,
        product_images (
          id,
          image_url,
          display_order,
          is_primary
        ),
        categories (
          id,
          name,
          created_at
        )
      `,
      { count: "exact" }
    );

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (status !== "all") {
      const isPublished = status === "active";
      query = query.eq("is_published", isPublished);
    }

    const sortColumn = sortBy === "created_at" ? "created_at" : sortBy;
    query = query.order(sortColumn, { ascending: sortOrder === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("상품 목록 조회 오류:", error);
      throw new Error(`상품 목록을 불러오는데 실패했습니다: ${error.message}`);
    }

    const adapter = new ProductListResponseAdapter(data);
    const products = adapter.adapt();

    return {
      products,
      total: count || 0,
    };
  } catch (error) {
    console.error("상품 목록 조회 중 오류:", error);
    throw error;
  }
};
