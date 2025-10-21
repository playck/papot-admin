export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
}
