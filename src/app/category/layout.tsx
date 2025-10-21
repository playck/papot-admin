"use client";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          카테고리 관리
        </h1>
        <div className="border-b border-gray-200" />
      </div>

      <div>{children}</div>
    </div>
  );
}
