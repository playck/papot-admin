export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_detail_address?: string;
  shipping_zip_code: string;
  delivery_request?: string;
  total_product_price: number;
  shipping_fee: number;
  coupon_discount: number;
  point_discount: number;
  final_price: number;
  status: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_description?: string;
  product_price: number;
  product_discount_rate: number;
  product_image_url?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: "created_at" | "final_price" | "order_number";
  sortOrder?: "asc" | "desc";
}
