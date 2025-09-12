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
  const subtotal = order.totalAmount - order.shippingFee + order.discountAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>주문 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">주문 번호</p>
            <p className="font-medium">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">주문 일시</p>
            <p className="font-medium">
              {dayjs(order.orderDate).format("YYYY-MM-DD HH:mm")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">주문 상태</p>
            <StatusBadge status={order.status} />
          </div>
          <div>
            <p className="text-sm text-gray-500">결제 방법</p>
            <p className="font-medium">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">고객 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">고객명</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">연락처</p>
              <p className="font-medium">{order.customerPhone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">배송 주소</p>
              <p className="font-medium">{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold mb-3">결제 정보</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">상품 금액</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">배송비</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>할인 금액</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-4 border-t">
              <span>총 결제 금액</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {order.orderNotes && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">주문 메모</h3>
            <p className="text-gray-600">{order.orderNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
