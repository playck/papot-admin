"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui";

import OrderSearchBar from "./OrderSearchBar";
import OrderTable from "./OrderTable";
import OrderListEmpty from "./OrderListEmpty";

// 임시 테스트 데이터
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    productId: "prod-001",
    productName: "프리미엄 스킨케어 세트",
    orderDate: "2024-01-15T10:30:00Z",
    totalAmount: 89000,
    quantity: 2,
    customerName: "김민수",
    customerPhone: "010-1234-5678",
    shippingAddress: "서울시 강남구 테헤란로 123",
    paymentMethod: "카드",
    shippingFee: 3000,
    discountAmount: 5000,
    status: "배송중",
    orderNotes: "문 앞에 놓아주세요",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    productId: "prod-002",
    productName: "비타민 C 세럼",
    orderDate: "2024-01-14T15:45:00Z",
    totalAmount: 45000,
    quantity: 1,
    customerName: "이영희",
    customerPhone: "010-9876-5432",
    shippingAddress: "부산시 해운대구 센텀로 456",
    paymentMethod: "계좌이체",
    shippingFee: 3000,
    discountAmount: 0,
    status: "배송완료",
    orderNotes: "",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-16T09:30:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    productId: "prod-003",
    productName: "하이드레이팅 마스크팩 10매",
    orderDate: "2024-01-13T09:15:00Z",
    totalAmount: 32000,
    quantity: 3,
    customerName: "박철수",
    customerPhone: "010-5555-7777",
    shippingAddress: "대구시 중구 동성로 789",
    paymentMethod: "카드",
    shippingFee: 0,
    discountAmount: 3000,
    status: "결제완료",
    orderNotes: "빠른 배송 부탁드립니다",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    productId: "prod-004",
    productName: "안티에이징 크림",
    orderDate: "2024-01-12T20:00:00Z",
    totalAmount: 125000,
    quantity: 1,
    customerName: "정수연",
    customerPhone: "010-3333-4444",
    shippingAddress: "인천시 연수구 송도국제로 321",
    paymentMethod: "현금",
    shippingFee: 3000,
    discountAmount: 10000,
    status: "취소",
    orderNotes: "고객 요청으로 취소",
    createdAt: "2024-01-12T20:00:00Z",
    updatedAt: "2024-01-13T10:30:00Z",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    productId: "prod-005",
    productName: "선크림 SPF50+",
    orderDate: "2024-01-11T11:20:00Z",
    totalAmount: 28000,
    quantity: 2,
    customerName: "최동욱",
    customerPhone: "010-8888-9999",
    shippingAddress: "광주시 서구 상무대로 654",
    paymentMethod: "카드",
    shippingFee: 3000,
    discountAmount: 2000,
    status: "배송준비중",
    orderNotes: "",
    createdAt: "2024-01-11T11:20:00Z",
    updatedAt: "2024-01-12T08:45:00Z",
  },
];

export default function OrderListView() {
  const [inputValue, setInputValue] = useState(""); // 입력 필드의 값
  const [activeSearchTerm, setActiveSearchTerm] = useState(""); // 실제 검색에 사용되는 값
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [isLoading] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🔒 인증 확인 및 리다이렉트
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // 실제 검색어가 변경될 때만 필터링 실행
  useEffect(() => {
    if (!activeSearchTerm.trim()) {
      setFilteredOrders(mockOrders);
    } else {
      const filtered = mockOrders.filter(
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
  }, [activeSearchTerm]);

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
