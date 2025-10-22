import { Order } from "@/features/order/types/order";

interface StatusBadgeProps {
  status: Order["status"];
  size?: "sm" | "md" | "lg";
  className?: string;
}

const getStatusColor = (status: Order["status"]) => {
  const statusColors = {
    주문접수: "bg-blue-100 text-blue-800",
    결제완료: "bg-green-100 text-green-800",
    배송준비중: "bg-yellow-100 text-yellow-800",
    배송중: "bg-purple-100 text-purple-800",
    배송완료: "bg-gray-100 text-gray-800",
    취소: "bg-red-100 text-red-800",
    반품: "bg-orange-100 text-orange-800",
  };

  return (
    statusColors[status as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800"
  );
};

const getSizeClasses = (size: "sm" | "md" | "lg") => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };
  return sizeClasses[size];
};

const getOrderStatusText = (status: Order["status"]): string => {
  const statusMap = {
    pending: "결제 대기",
    confirmed: "결제 완료",
    processing: "상품 준비중",
    shipped: "배송중",
    delivered: "배송 완료",
    cancelled: "주문 취소",
  };

  return statusMap[status as keyof typeof statusMap] || "알 수 없음";
};

export default function StatusBadge({
  status,
  size = "sm",
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full font-medium ${getStatusColor(
        status
      )} ${getSizeClasses(size)} ${className}`}
    >
      {getOrderStatusText(status)}
    </span>
  );
}
