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
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium pl-3">
        <Link
          href={`/order/detail/${order.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {order.orderNumber}
        </Link>
      </TableCell>
      <TableCell>{order.productName}</TableCell>
      <TableCell>{dayjs(order.orderDate).format("YYYY-MM-DD HH:mm")}</TableCell>
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
        <StatusBadge status={order.status} />
      </TableCell>
      <TableCell>{order.paymentMethod}</TableCell>
      <TableCell>
        <div className="max-w-32 truncate text-sm text-gray-600">
          {order.shippingAddress}
        </div>
      </TableCell>
    </TableRow>
  );
}
