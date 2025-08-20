"use client";

import { useState } from "react";

interface MenuItem {
  id: string;
  title: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", title: "대시보드", icon: "📊" },
  { id: "products", title: "상품 관리", icon: "🪴" },
  { id: "orders", title: "주문 관리", icon: "🛒" },
  { id: "settings", title: "설정", icon: "⚙️" },
];

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="w-[12.5%] min-h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-8">🐼 PAPOT ADMIN</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                activeMenu === item.id
                  ? "bg-blue-50 text-green-700 border-l-4 border-green-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
