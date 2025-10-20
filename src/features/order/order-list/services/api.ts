import { supabase } from "@/services/supabase/client";
import { Order, OrderListParams, OrderListResponse } from "../../types/order";

export type { OrderListParams, OrderListResponse };

export const getOrderList = async (
  params: OrderListParams = {}
): Promise<OrderListResponse> => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    sortBy = "created_at",
    sortOrder = "desc",
  } = params;

  try {
    let query = supabase.from("orders").select(
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
      `,
      { count: "exact" }
    );

    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,recipient_name.ilike.%${search}%,recipient_phone.ilike.%${search}%`
      );
    }

    if (status) {
      query = query.eq("status", status);
    }

    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const mappedOrders = (data || []).map((order) => ({
      ...order,
      items: order.order_items || [],
    }));

    return {
      orders: mappedOrders as Order[],
      total: count || 0,
    };
  } catch (error) {
    console.error("주문 목록 조회 실패:", error);
    throw error;
  }
};
