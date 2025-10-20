import { useQuery } from "@tanstack/react-query";
import { getOrderDetail } from "../api";

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
