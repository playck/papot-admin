import OrderDetailView from "@/features/order/detail/components/OrderDetailView";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto">
      <OrderDetailView orderId={id} />
    </div>
  );
}
