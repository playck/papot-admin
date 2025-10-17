"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components";
import { formatCurrency } from "@/lib/utils";
import { Order } from "../../types/order";

interface OrderRowProps {
  order: Order;
}

export default function OrderRow({ order }: OrderRowProps) {
  const firstItem = order.items?.[0];
  const totalQuantity =
    order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const productDisplay = firstItem
    ? `${firstItem.product_name}${
        order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ""
      }`
    : "-";

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium pl-3">
        <Link
          href={`/order/detail/${order.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {order.order_number}
        </Link>
      </TableCell>
      <TableCell>{productDisplay}</TableCell>
      <TableCell>
        {dayjs(order.created_at).format("YYYY-MM-DD HH:mm")}
      </TableCell>
      <TableCell className="font-semibold">
        {formatCurrency(order.final_price)}
      </TableCell>
      <TableCell>{totalQuantity}개</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{order.recipient_name}</div>
          <div className="text-sm text-gray-500">{order.recipient_phone}</div>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>
      <TableCell>
        <div className="max-w-32 truncate text-sm text-gray-600">
          {order.shipping_address}
        </div>
      </TableCell>
    </TableRow>
  );
}
