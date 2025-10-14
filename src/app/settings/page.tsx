"use client";

import { MainImageContainer } from "@/features/settings/components";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-500 mt-2">시스템 설정을 관리합니다</p>
      </div>
      <div className="max-w-4xl space-y-6">
        <MainImageContainer />
      </div>
    </div>
  );
}
