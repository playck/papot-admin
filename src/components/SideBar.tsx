"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  path?: string;
}

const menuItems: MenuItem[] = [
  { id: "products", title: "상품 관리", icon: "🪴", path: "/product/list" },
  { id: "categories", title: "카테고리 관리", icon: "📁", path: "/category" },
  { id: "orders", title: "주문 관리", icon: "🛒", path: "/order/list" },
  { id: "settings", title: "설정", icon: "⚙️", path: "/settings" },
];

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out`}
    >
      {/* 헤더 영역 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex w-full items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-gray-800">🐼 PAPOT</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-7 h-7 text-gray-600" />
            ) : (
              <ChevronLeft className="w-7 h-7 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* 메뉴 영역 */}
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              href={item.path || ""}
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center px-2" : "px-4"
              } py-3 text-left rounded-lg transition-all duration-200 cursor-pointer group ${
                activeMenu === item.id
                  ? "bg-blue-50 text-green-700 font-semibold" +
                    (isCollapsed ? "" : " border-l-4 border-green-700")
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              title={isCollapsed ? item.title : undefined}
            >
              <span className={`text-lg ${isCollapsed ? "" : "mr-3"}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium">{item.title}</span>
              )}

              {/* 축소 모드 */}
              {isCollapsed && (
                <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
