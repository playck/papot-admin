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

export interface ProductBadge {
  id: string;
  productId: string;
  badgeName: string;
  createdAt: string;
}

export interface Category {
  id: number; // BIGINT 타입에 맞춰 수정
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  discountRate?: number;
  quantity: number;
  isPublished?: boolean;
  categoryId: number; // BIGINT 타입에 맞춰 수정
  images: string[]; // 이미지 URL 배열
  badges: string[]; // 뱃지 이름 배열
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
