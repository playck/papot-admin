export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const QUERY_KEYS = {
  PRODUCTS: "products",
  PRODUCT: "product",
  CATEGORIES: "categories",
  CATEGORY: "category",
} as const;

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_CREATE: "/products/create",
  PRODUCT_EDIT: "/products/edit",
  CATEGORIES: "/categories",
} as const;
