"use client";

import { usePathname } from "next/navigation";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    const route = pathname.split("/").pop();

    switch (route) {
      case "create":
        return "상품 등록";
      case "detail":
        return "상품 상세";
      case "list":
        return "상품 목록";
      default:
        return "상품 관리";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {getPageTitle()}
        </h1>
        <div className="border-b border-gray-200" />
      </div>

      <div>{children}</div>
    </div>
  );
}
