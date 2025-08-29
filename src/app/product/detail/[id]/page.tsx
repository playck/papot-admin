"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ProductDetailForm from "@/features/product/product-detail/components/ProductDetailForm";
import { useProductDetail } from "@/features/product/product-detail/services/hooks/useProductDetail";
import { ProductDetailAdapter } from "@/features/product/product-detail/adapter/ProductDetailAdapter";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useProductDetail(productId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-600">
              오류 발생
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {error.message || "상품 정보를 불러오는 중 오류가 발생했습니다."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              상품을 찾을 수 없습니다
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              요청하신 상품 정보를 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initialData = ProductDetailAdapter.adapt(product);

  return <ProductDetailForm initialData={initialData} isEditMode={true} />;
}
