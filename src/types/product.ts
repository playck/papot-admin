export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountRate: number;
  quantity: number;
  isPublished: boolean;
  categoryId: number; // BIGINT는 JavaScript에서 number로 처리
  category?: Category;
  images: ProductImage[];
  badges: ProductBadge[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface UploadedImageData {
  url: string;
}

export interface ProductBadge {
  id: string;
  productId: string;
  badgeName: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  discount_rate?: number;
  quantity: number;
  is_published?: boolean;
  category_id: number;
  images: UploadedImageData[];
  badges: string[];
  uploaded_by?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
