import { supabase } from "@/services/supabase/client";
import { Order } from "@/features/order/types/order";

export const getOrderDetail = async (orderId: string): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        order_id,
        product_id,
        product_name,
        product_description,
        product_price,
        product_discount_rate,
        product_image_url,
        quantity,
        unit_price,
        total_price,
        created_at,
        updated_at
      )
    `
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("주문 상세 조회 실패:", error);
    throw new Error("주문 정보를 불러오는데 실패했습니다.");
  }

  if (!data) {
    throw new Error("주문을 찾을 수 없습니다.");
  }

  return {
    ...data,
    items: data.order_items || [],
  } as Order;
};
