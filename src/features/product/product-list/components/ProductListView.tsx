"use client";

import { useState } from "react";

import ProductSearchBar from "./ProductSearchBar";
import ProductTable from "./ProductTable";

// 임시 데이터 타입
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: "active" | "inactive";
  badges: string[];
  createdAt: string;
}

// 임시 데이터
const mockProducts: Product[] = [
  {
    id: "1",
    name: "프리미엄 노트북 스탠드",
    price: 45000,
    quantity: 150,
    status: "active",
    badges: ["베스트셀러", "무료배송"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "인체공학 무선 마우스",
    price: 35000,
    quantity: 0,
    status: "inactive",
    badges: ["신상품"],
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "USB-C 멀티 허브",
    price: 68000,
    quantity: 75,
    status: "active",
    badges: ["할인중", "인기상품"],
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "기계식 키보드",
    price: 125000,
    quantity: 30,
    status: "active",
    badges: ["프리미엄"],
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "4K 웹캠",
    price: 89000,
    quantity: 5,
    status: "active",
    badges: ["품절임박", "무료배송"],
    createdAt: "2024-01-11",
  },
];

export default function ProductListView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSearchTerm, setFilteredSearchTerm] = useState("");
  const [products] = useState<Product[]>(mockProducts);
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filteredSearchTerm.toLowerCase())
  );

  const handleSearch = (searchKeyword: string) => {
    setFilteredSearchTerm(searchKeyword);
    console.log("검색 실행:", searchKeyword);
  };

  return (
    <div className="space-y-6">
      <ProductSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
      />
      <ProductTable
        products={filteredProducts}
        filteredSearchTerm={filteredSearchTerm}
      />
    </div>
  );
}
