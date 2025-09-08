"use client";

import { useState, useRef } from "react";
import { useImageUpload } from "@/services/hooks/useImageUpload";

interface UseImageUploadProps {
  images: string[];
  onChange?: (images: string[]) => void;
  maxFiles: number;
}

export const useImageInputUpload = ({
  images,
  onChange,
  maxFiles,
}: UseImageUploadProps) => {
  const { uploadMultiple, isUploading: isSupabaseUploading } = useImageUpload();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMaxReached = images.length >= maxFiles;

  const handleFileChange = async (files: FileList) => {
    const validFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, maxFiles - images.length);

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const newImageUrls = await uploadMultiple(validFiles, {
        pathPrefix: "products",
        includeUserId: true,
        addTimestamp: true,
      });

      onChange?.([...images, ...newImageUrls.successList]);
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
    isUploading: isUploading || isSupabaseUploading,
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
