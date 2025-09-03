"use client";

import { Search, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch?: (searchTerm: string) => void;
  onClear?: () => void;
}

export default function OrderSearchBar({
  searchTerm,
  onSearchChange,
  onSearch,
  onClear,
}: OrderSearchBarProps) {
  const handleSearch = () => {
    onSearch?.(searchTerm);
  };

  const handleClear = () => {
    onSearchChange("");
    onClear?.();
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
          placeholder="주문번호, 상품명, 주문자명으로 검색하세요!"
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
        <Button variant="outline" onClick={handleClear}>
          <X className="h-4 w-4" />
          초기화
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4" />
          엑셀 다운로드
        </Button>
      </div>
    </div>
  );
}
