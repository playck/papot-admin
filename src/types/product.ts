export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  imageUrl?: string;
  status: "active" | "inactive";
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  stockQuantity: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
  status?: "active" | "inactive";
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
