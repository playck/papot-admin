"use client";

import { useImageUpload } from "@/services/hooks/useImageUpload";
import { extractBase64ImagesFromHtml, base64ToFile } from "@/lib/utils";

// Base64 방식에서는 매개변수 불필요
// interface UseEditorImageManagerProps {
//   isEditMode?: boolean;
//   initialDescription?: string;
// }

interface UseEditorImageManagerReturn {
  uploadBase64ImagesToStorage: (htmlContent: string) => Promise<string>;
}

export const useEditorImageManager = (): UseEditorImageManagerReturn => {
  const { uploadSingle } = useImageUpload();

  // Base64 이미지를 스토리지에 업로드하고 URL로 교체
  const uploadBase64ImagesToStorage = async (
    htmlContent: string
  ): Promise<string> => {
    const base64Images = extractBase64ImagesFromHtml(htmlContent);

    if (base64Images.length === 0) {
      return htmlContent;
    }

    let updatedHtml = htmlContent;

    for (const base64Data of base64Images) {
      try {
        const file = base64ToFile(base64Data, "editor-image.png");

        const storageUrl = await uploadSingle(file, {
          pathPrefix: "editor-images",
          addTimestamp: true,
        });

        updatedHtml = updatedHtml.replace(base64Data, storageUrl);
      } catch (error) {
        console.error("Base64 이미지 업로드 실패:", error);
      }
    }

    return updatedHtml;
  };

  return {
    uploadBase64ImagesToStorage,
  };
};
