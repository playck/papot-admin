export interface Order {
  id: string;
  orderNumber: string;
  userId?: string; // 사용자 ID (로그인 사용자)
  productId: string;
  productName: string;
  orderDate: string;
  totalAmount: number;
  quantity: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: "카드" | "계좌이체" | "현금";
  shippingFee: number;
  discountAmount: number;
  status:
    | "주문접수"
    | "결제완료"
    | "배송준비중"
    | "배송중"
    | "배송완료"
    | "취소"
    | "반품";
  orderNotes?: string;
  items: OrderItem[]; // 주문 아이템 배열
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string; // 주문 당시 상품명 (비정규화)
  productImage?: string; // 대표 이미지
  quantity: number;
  unitPrice: number; // 주문 당시 단가
  totalPrice: number; // quantity * unitPrice
  createdAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}
