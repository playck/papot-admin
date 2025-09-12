import OrderDetailView from "@/features/order/detail/components/OrderDetailView";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <div className="container mx-auto">
      <OrderDetailView orderId={params.id} />
    </div>
  );
}
