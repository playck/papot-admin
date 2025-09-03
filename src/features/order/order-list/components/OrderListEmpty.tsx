interface OrderListEmptyProps {
  searchTerm: string;
}

export default function OrderListEmpty({ searchTerm }: OrderListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-500 mb-2">📋</div>
      <div className="text-gray-600">
        {searchTerm
          ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
          : "등록된 주문이 없습니다."}
      </div>
      <div className="text-sm text-gray-500 mt-1">
        {searchTerm
          ? "다른 키워드로 검색해보세요."
          : "주문이 들어오면 여기에 표시됩니다."}
      </div>
    </div>
  );
}
