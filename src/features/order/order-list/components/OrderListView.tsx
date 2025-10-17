"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui";
import { useOrderList } from "../services";

import OrderSearchBar from "./OrderSearchBar";
import OrderTable from "./OrderTable";
import OrderListEmpty from "./OrderListEmpty";

export default function OrderListView() {
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data, isLoading, error } = useOrderList({
    search: searchTerm,
    limit: 50,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <LoadingSpinner message="인증 확인 중..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const orders = data?.orders || [];
  const isOrderEmpty = !isLoading && orders.length === 0;
  const isExistOrder = !isLoading && orders.length > 0;

  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
        </div>
      </div>

      <OrderSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {isLoading && <LoadingSpinner message="주문 목록을 불러오는 중..." />}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">주문 목록을 불러오는데 실패했습니다.</p>
        </div>
      )}

      {isOrderEmpty && <OrderListEmpty searchTerm={searchTerm} />}

      {isExistOrder && (
        <OrderTable orders={orders} filteredSearchTerm={searchTerm} />
      )}
    </div>
  );
}
