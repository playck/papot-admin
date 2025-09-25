"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import OrderRow from "./OrderRow";
import { Order } from "../../types/order";

interface OrderTableProps {
  orders: Order[];
  filteredSearchTerm: string;
}

export default function OrderTable({
  orders,
  filteredSearchTerm,
}: OrderTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-3">주문번호</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead>주문일시</TableHead>
              <TableHead>총 주문금액</TableHead>
              <TableHead>수량</TableHead>
              <TableHead>주문자</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>결제방법</TableHead>
              <TableHead>배송지</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => <OrderRow key={order.id} order={order} />)
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="text-gray-500">
                    {filteredSearchTerm ? (
                      <>
                        <p className="text-lg mb-2">
                          &ldquo;{filteredSearchTerm}&rdquo;에 대한 검색 결과가
                          없습니다
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg mb-2">등록된 주문이 없습니다</p>
                        <p className="text-sm">
                          주문이 들어오면 여기에 표시됩니다
                        </p>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 (추후 구현) */}
      <div className="border-t pl-3 pr-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">총 {orders.length}개의 주문</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              이전
            </Button>
            <Button variant="outline" size="sm">
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
