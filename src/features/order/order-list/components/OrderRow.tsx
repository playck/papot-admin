"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Order } from "../../types/order";

interface OrderRowProps {
  order: Order;
}

const getStatusColor = (status: Order["status"]) => {
  const statusColors = {
    주문접수: "bg-blue-100 text-blue-800",
    결제완료: "bg-green-100 text-green-800",
    배송준비중: "bg-yellow-100 text-yellow-800",
    배송중: "bg-purple-100 text-purple-800",
    배송완료: "bg-gray-100 text-gray-800",
    취소: "bg-red-100 text-red-800",
    반품: "bg-orange-100 text-orange-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderRow({ order }: OrderRowProps) {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium pl-3">{order.orderNumber}</TableCell>
      <TableCell>{order.productName}</TableCell>
      <TableCell>{formatDate(order.orderDate)}</TableCell>
      <TableCell className="font-semibold">
        {formatCurrency(order.totalAmount)}
      </TableCell>
      <TableCell>{order.quantity}개</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{order.customerName}</div>
          <div className="text-sm text-gray-500">{order.customerPhone}</div>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </TableCell>
      <TableCell>{order.paymentMethod}</TableCell>
      <TableCell>
        <div className="max-w-32 truncate text-sm text-gray-600">
          {order.shippingAddress}
        </div>
      </TableCell>
      <TableCell>
        {order.orderNotes ? (
          <div
            className="max-w-24 truncate text-sm text-gray-600"
            title={order.orderNotes}
          >
            {order.orderNotes}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}
