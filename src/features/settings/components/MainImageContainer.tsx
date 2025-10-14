"use client";

import { useMainImageSettings } from "@/features/settings/hooks/useMainImageSettings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MainImageSection } from "./MainImageSection";

export function MainImageContainer() {
  const { mainImage, isLoading, isUploading, isSaving, handleImageChange } =
    useMainImageSettings();

  if (isLoading) {
    return <LoadingSpinner size="lg" message="설정 불러오는 중..." />;
  }

  return (
    <MainImageSection
      images={mainImage}
      onImageChange={handleImageChange}
      disabled={isUploading || isSaving}
    />
  );
}
