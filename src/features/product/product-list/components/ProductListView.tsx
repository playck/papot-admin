"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductSearch } from "../services/hooks/useProductList";
import { useToast } from "@/providers/toast-provider";
import { useAuth } from "@/services/hooks/useAuth";
import { ErrorMessage } from "@/components";
import { LoadingSpinner } from "@/components/ui";

import ProductSearchBar from "./ProductSearchBar";
import ProductTable from "./ProductTable";

export default function ProductListView() {
  const [searchTerm, setSearchTerm] = useState("");
  const { showError } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // 🔒 인증 확인 및 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const {
    data: productData,
    isLoading,
    error,
    refetch,
  } = useProductSearch(searchTerm, 300);

  if (authLoading) {
    return <LoadingSpinner message="인증 확인 중..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSearchProduct = (searchKeyword: string) => {
    setSearchTerm(searchKeyword);
  };

  const handleRetryApi = () => {
    refetch();
  };

  if (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "상품 목록을 불러오는데 실패했어요 ㅠㅠ";

    showError("데이터 로드 실패", errorMessage);
  }

  const isEmpty =
    !isLoading && !error && productData && productData.products.length === 0;
  const isExistProduct =
    !isLoading && !error && productData && productData.products.length > 0;

  return (
    <div className="space-y-6">
      <ProductSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearchProduct}
      />

      {isLoading && <LoadingSpinner message="상품 목록을 불러오는 중..." />}

      {error && !isLoading && (
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다."
          }
          onRetry={handleRetryApi}
        />
      )}

      {/* 빈 상태 */}
      {isEmpty && <EmptyState />}

      {/* 상품 테이블 */}
      {isExistProduct && (
        <ProductTable
          products={productData.products}
          filteredSearchTerm={searchTerm}
        />
      )}
    </div>
  );
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-gray-500 mb-2">📦</div>
    <div className="text-gray-600">등록된 상품이 없습니다.</div>
    <div className="text-sm text-gray-500 mt-1">
      지금 바로 첫 번째 상품을 등록해보세요!
    </div>
  </div>
);
