"use client";

import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddProduct?: () => void;
  onSearch?: (searchTerm: string) => void;
}

export default function ProductSearchBar({
  searchTerm,
  onSearchChange,
  onAddProduct,
  onSearch,
}: ProductSearchBarProps) {
  const handleSearch = () => {
    onSearch?.(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* 검색 입력 */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="상품명을 입력하고 검색 버튼을 눌러주세요!"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          검색
        </Button>
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4" />
          상품 추가
        </Button>
      </div>
    </div>
  );
}
