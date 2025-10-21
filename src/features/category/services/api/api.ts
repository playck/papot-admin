import { supabase } from "@/services/supabase/client";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryListResponse,
} from "../../types/category";

/**
 * 카테고리 목록 조회
 */
export async function getCategories(): Promise<CategoryListResponse> {
  const { data, error, count } = await supabase
    .from("categories")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("카테고리 목록 조회 실패:", error);
    throw new Error("카테고리 목록을 불러오는데 실패했습니다.");
  }

  const categories: Category[] =
    data?.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) || [];

  return {
    categories,
    total: count || 0,
  };
}

/**
 * 카테고리 단일 조회
 */
export async function getCategoryById(id: number): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("카테고리를 불러오는데 실패했습니다.");
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * 카테고리 생성
 */
export async function createCategory(
  categoryData: CreateCategoryRequest
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: categoryData.name,
    })
    .select()
    .single();

  if (error) {
    throw new Error("카테고리 생성에 실패했습니다.");
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * 카테고리 수정
 */
export async function updateCategory(
  categoryData: UpdateCategoryRequest
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: categoryData.name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryData.id)
    .select()
    .single();

  if (error) {
    throw new Error("카테고리 수정에 실패했습니다.");
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * 카테고리 삭제
 */
export async function deleteCategory(id: number): Promise<void> {
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    throw new Error("카테고리 삭제 전 확인에 실패했습니다.");
  }

  if (count && count > 0) {
    throw new Error(
      `이 카테고리를 사용하는 상품이 ${count}개 있습니다. 상품을 먼저 삭제하거나 다른 카테고리로 변경해주세요.`
    );
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error("카테고리 삭제에 실패했습니다.");
  }
}
