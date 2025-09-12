"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useOrderDetail } from "../services/hooks/useOrderDetail";
import OrderDetailInfo from "./OrderDetailInfo";
import OrderItemList from "./OrderItemList";

interface OrderDetailViewProps {
  orderId: string;
}

export default function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const router = useRouter();
  const { data: order, isLoading, error } = useOrderDetail(orderId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">
          주문 정보를 불러오는데 실패했습니다.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          뒤로 가기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">주문 상세</h1>
        <Button onClick={() => router.back()} variant="outline">
          목록으로
        </Button>
      </div>

      <OrderDetailInfo order={order} />
      <OrderItemList items={order.items} />
    </div>
  );
}
