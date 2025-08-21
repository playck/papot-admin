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
import ProductRow from "./ProductRow";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: "active" | "inactive";
  badges: string[];
  createdAt: string;
}

interface ProductTableProps {
  products: Product[];
  filteredSearchTerm: string;
}

export default function ProductTable({
  products,
  filteredSearchTerm,
}: ProductTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상품명</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>재고</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>뱃지</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-center">상세보기</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
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
                        <p className="text-lg mb-2">등록된 상품이 없습니다</p>
                        <p className="text-sm">새 상품을 추가해보세요</p>
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
      <div className="border-t px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">총 {products.length}개의 상품</p>
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
