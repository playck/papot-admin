"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase/client";
import { Order } from "@/features/order/types/order";

// 임시 목 데이터
const mockOrder: Order = {
  id: "test-id",
  orderNumber: "ORD-2024-0001",
  productId: "prod-1",
  productName: "프리미엄 유기농 사과",
  orderDate: new Date().toISOString(),
  totalAmount: 52500,
  quantity: 3,
  customerName: "김고객",
  customerPhone: "010-1234-5678",
  shippingAddress: "서울특별시 강남구 테헤란로 123, 아파트 101동 1001호",
  paymentMethod: "카드",
  shippingFee: 3000,
  discountAmount: 5000,
  status: "배송준비중",
  orderNotes: "부재 시 경비실에 맡겨주세요.",
  items: [
    {
      id: "item-1",
      orderId: "test-id",
      productId: "prod-1",
      productName: "프리미엄 유기농 사과 1박스 (10개입)",
      productImage:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",
      quantity: 2,
      unitPrice: 25000,
      totalPrice: 50000,
      createdAt: new Date().toISOString(),
    },
    {
      id: "item-2",
      orderId: "test-id",
      productId: "prod-2",
      productName: "달콤한 제주 감귤 2kg",
      productImage:
        "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop",
      quantity: 1,
      unitPrice: 15000,
      totalPrice: 15000,
      createdAt: new Date().toISOString(),
    },
    {
      id: "item-3",
      orderId: "test-id",
      productId: "prod-3",
      productName: "친환경 방울토마토 500g",
      productImage:
        "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&h=200&fit=crop",
      quantity: 2,
      unitPrice: 8000,
      totalPrice: 16000,
      createdAt: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function fetchOrderDetail(orderId: string): Promise<Order | null> {
  // 개발 환경에서 임시 데이터 반환
  if (process.env.NODE_ENV === "development") {
    // 1초 지연을 추가하여 로딩 상태도 확인 가능
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockOrder;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(*)
    `
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order detail:", error);
    throw new Error("주문 정보를 불러오는데 실패했습니다.");
  }

  return data as Order;
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetail(orderId),
    enabled: !!orderId,
  });
}
