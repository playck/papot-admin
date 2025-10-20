"use client";

import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/features/order/types/order";

interface OrderDetailInfoProps {
  order: Order;
}

export default function OrderDetailInfo({ order }: OrderDetailInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>주문 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">주문 번호</p>
            <p className="font-medium">{order.order_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">주문 일시</p>
            <p className="font-medium">
              {dayjs(order.created_at).format("YYYY-MM-DD HH:mm")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">주문 상태</p>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">받는 사람 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">받는 사람</p>
              <p className="font-medium">{order.recipient_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">연락처</p>
              <p className="font-medium">{order.recipient_phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">배송 주소</p>
              <p className="font-medium">
                ({order.shipping_zip_code}) {order.shipping_address}
                {order.shipping_detail_address &&
                  `, ${order.shipping_detail_address}`}
              </p>
            </div>
            {order.delivery_request && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">배송 요청사항</p>
                <p className="font-medium">{order.delivery_request}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-3">결제 정보</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">상품 금액</span>
              <span>{formatCurrency(order.total_product_price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">배송비</span>
              <span>{formatCurrency(order.shipping_fee)}</span>
            </div>
            {order.coupon_discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>쿠폰 할인</span>
                <span>-{formatCurrency(order.coupon_discount)}</span>
              </div>
            )}
            {order.point_discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>포인트 할인</span>
                <span>-{formatCurrency(order.point_discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-4 border-t">
              <span>최종 결제 금액</span>
              <span>{formatCurrency(order.final_price)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
