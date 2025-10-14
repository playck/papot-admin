"use client";

import { useMainImageSettings } from "@/features/settings/hooks/useMainImageSettings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MainImageSection } from "./MainImageSection";
import { SettingsSaveButton } from "./SettingsSaveButton";

export function MainImageContainer() {
  const {
    mainImage,
    isLoading,
    isUploading,
    isSaving,
    handleImageChange,
    handleSave,
  } = useMainImageSettings();

  if (isLoading) {
    return <LoadingSpinner size="lg" message="설정 불러오는 중..." />;
  }

  return (
    <div className="space-y-6">
      <MainImageSection
        images={mainImage}
        onImageChange={handleImageChange}
        disabled={isUploading || isSaving}
      />

      <SettingsSaveButton
        onClick={handleSave}
        disabled={isUploading || isSaving}
        isSaving={isSaving}
      />
    </div>
  );
}
