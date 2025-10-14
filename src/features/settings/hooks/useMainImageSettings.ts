import { useState, useEffect } from "react";
import { useSettings } from "../services/hooks/useSettings";
import { useUpdateMainImage } from "../services/hooks/useUpdateMainImage";
import { useToast } from "@/providers/toast-provider";
import { useImageUpload } from "@/services/hooks/useImageUpload";

export const useMainImageSettings = () => {
  const { data: settings, isLoading } = useSettings();
  const { mutateAsync: updateMainImage, isPending: isSaving } =
    useUpdateMainImage();
  const { deleteFile, isUploading } = useImageUpload();
  const { showSuccess, showError } = useToast();
  const [mainImage, setMainImage] = useState<string[]>([]);

  useEffect(() => {
    setMainImage(settings?.main_image_url ? [settings.main_image_url] : []);
  }, [settings]);

  const handleImageDelete = async () => {
    if (!settings?.main_image_url || !settings?.id) return;

    try {
      await deleteFile(settings.main_image_url);
      await updateMainImage({ settingsId: settings.id, imageUrl: null });
      setMainImage([]);
      showSuccess("메인 이미지가 삭제되었습니다.");
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      showError("이미지 삭제에 실패했습니다.");
      throw error;
    }
  };

  const handleImageChange = async (images: string[]) => {
    if (images.length === 0 && settings?.main_image_url) {
      await handleImageDelete();
    } else if (images.length > 0 && settings?.id) {
      setMainImage(images);
      try {
        await updateMainImage({ settingsId: settings.id, imageUrl: images[0] });
        showSuccess("메인 이미지가 저장되었습니다.");
      } catch (error) {
        console.error("이미지 저장 실패:", error);
        showError("이미지 저장에 실패했습니다.");
      }
    }
  };

  return {
    mainImage,
    isLoading,
    isUploading,
    isSaving,
    handleImageChange,
  };
};
