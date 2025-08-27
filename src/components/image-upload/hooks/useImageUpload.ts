"use client";

import * as React from "react";
import { useAuth } from "@/services/hooks/useAuth";
import { supabase } from "@/services/supabase/client";

interface UseImageUploadProps {
  images: string[];
  onChange?: (images: string[]) => void;
  maxFiles: number;
}

export const useImageUpload = ({
  images,
  onChange,
  maxFiles,
}: UseImageUploadProps) => {
  const { user } = useAuth();
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isUserLoggedIn = !!user?.id;
  const isMaxReached = images.length >= maxFiles;

  const handleFileChange = async (files: FileList) => {
    if (!isUserLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    const validFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, maxFiles - images.length);

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const newImages = await Promise.all(
        validFiles.map(async (file) => {
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(2);
          const cleanFileName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, "_")
            .replace(/\s+/g, "_");
          const fileName = `${user?.id}/${timestamp}_${randomId}_${cleanFileName}`;

          const { error } = await supabase.storage
            .from("product-images")
            .upload(fileName, file, {
              metadata: {
                userId: user?.id,
                uploadedAt: new Date().toISOString(),
              },
            });

          if (error) {
            console.error("이미지 업로드 실패:", error);
            throw error;
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("product-images").getPublicUrl(fileName);

          return publicUrl;
        })
      );

      onChange?.([...images, ...newImages]);
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange?.(newImages);
  };

  const handleClick = () => {
    if (images.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  return {
    isDragOver,
    isUploading,
    isUserLoggedIn,
    isMaxReached,

    fileInputRef,

    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveImage,
    handleClick,
  };
};
