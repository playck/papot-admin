"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui";

import OrderSearchBar from "./OrderSearchBar";
import OrderTable from "./OrderTable";
import OrderListEmpty from "./OrderListEmpty";

import { Order } from "../../types/order";

export default function OrderListView() {
  const [inputValue, setInputValue] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 인증 확인 및 리다이렉트
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // 주문 데이터 로드
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        // TODO: 실제 API 호출로 교체
        // const response = await orderAPI.getOrders();
        // setOrders(response.orders);

        // 임시로 빈 배열 설정
        setOrders([]);
      } catch (error) {
        console.error("주문 목록 조회 실패:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // 검색어가 변경될 때 필터링 실행
  useEffect(() => {
    if (!activeSearchTerm.trim()) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          order.orderNumber
            .toLowerCase()
            .includes(activeSearchTerm.toLowerCase()) ||
          order.productName
            .toLowerCase()
            .includes(activeSearchTerm.toLowerCase()) ||
          order.customerName
            .toLowerCase()
            .includes(activeSearchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [activeSearchTerm, orders]);

  if (authLoading) {
    return <LoadingSpinner message="인증 확인 중..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSearchOrder = (searchKeyword: string) => {
    setActiveSearchTerm(searchKeyword);
  };

  const handleClearSearch = () => {
    setActiveSearchTerm("");
  };

  const isOrderEmpty = !isLoading && filteredOrders.length === 0;
  const isExistOrder = !isLoading && filteredOrders.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
        </div>
      </div>

      <OrderSearchBar
        searchTerm={inputValue}
        onSearchChange={setInputValue}
        onSearch={handleSearchOrder}
        onClear={handleClearSearch}
      />

      {isLoading && <LoadingSpinner message="주문 목록을 불러오는 중..." />}

      {isOrderEmpty && <OrderListEmpty searchTerm={activeSearchTerm} />}

      {/* 주문 테이블 */}
      {isExistOrder && (
        <OrderTable
          orders={filteredOrders}
          filteredSearchTerm={activeSearchTerm}
        />
      )}
    </div>
  );
}
