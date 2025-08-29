"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/features/product/types/product";
import { formatDate, formatPrice } from "@/lib/utils";

interface ProductRowProps {
  product: Product;
}

export default function ProductRow({ product }: ProductRowProps) {
  const router = useRouter();

  const getStatusBadge = (isPublished: boolean) => {
    return isPublished ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        판매중
      </Badge>
    ) : (
      <Badge variant="secondary">판매중지</Badge>
    );
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity === 0) return "text-red-600 font-medium";
    if (quantity < 10) return "text-orange-600 font-medium";
    return "";
  };

  const handleViewDetail = () => {
    router.push(`/product/detail/${product.id}`);
  };

  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium pl-3">{product.name}</TableCell>
      <TableCell>{formatPrice(product.price)}</TableCell>
      <TableCell>
        <span className={getQuantityColor(product.quantity)}>
          {product.quantity}개
        </span>
      </TableCell>
      <TableCell>{getStatusBadge(product.isPublished)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {product.badges && product.badges.length > 0 ? (
            product.badges.map((badge, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {badge}
              </Badge>
            ))
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-gray-500">
        {formatDate(product.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetail}
          className="h-8"
        >
          상세보기
        </Button>
      </TableCell>
    </TableRow>
  );
}
