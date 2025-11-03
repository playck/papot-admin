export interface Category {
  id: number;
  name: string;
  parentId?: number | null;
  createdAt: string;
  updatedAt?: string;
  children?: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  parentId?: number | null;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
  parentId?: number | null;
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
}
