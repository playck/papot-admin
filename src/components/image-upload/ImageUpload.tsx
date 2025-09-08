"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useImageInputUpload } from "./hooks/useImageUpload";

const GRID_RESPONSIVE_CLASSES = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
const MAX_FILE_SIZE_MB = 5;

const getUploadAreaStyles = (
  isDragOver: boolean,
  isMaxReached: boolean,
  disabled: boolean
) => {
  return cn(
    `relative w-full h-32 border-2 border-dashed rounded-lg transition-colors`,
    {
      "border-primary bg-primary/5": isDragOver,
      "border-gray-300 hover:border-gray-400": !isDragOver,
      "cursor-not-allowed opacity-50": isMaxReached || disabled,
      "cursor-pointer": !isMaxReached && !disabled,
    }
  );
};

interface ImageUploadProps {
  images?: string[];
  onChange?: (images: string[]) => void;
  placeholder?: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images = [],
  onChange,
  placeholder = "이미지를 선택하거나 드래그 해 주세요.",
  accept = "image/*",
  className,
  disabled = false,
  maxFiles = 5,
}) => {
  const {
    isDragOver,
    isUploading,
    isMaxReached,
    fileInputRef,
    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveImage,
    handleClick,
  } = useImageInputUpload({ images, onChange, maxFiles });

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        multiple
      />

      <div
        className={getUploadAreaStyles(
          isDragOver,
          isMaxReached,
          disabled || isUploading
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={
          !disabled && !isMaxReached && !isUploading ? handleClick : undefined
        }
      >
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2" />
          ) : (
            <Upload className="w-8 h-8 mb-2" />
          )}
          <p className="text-sm text-center px-2">
            {isUploading
              ? "이미지 업로드 중..."
              : isMaxReached
              ? `최대 ${maxFiles}개 이미지까지 업로드 가능합니다`
              : placeholder}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (최대 {MAX_FILE_SIZE_MB}MB) • {images.length}/{maxFiles}
          </p>
        </div>
      </div>

      {/* 이미지 리스트 */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            업로드된 이미지 ({images.length})
          </h4>
          <div className={`grid ${GRID_RESPONSIVE_CLASSES} gap-4`}>
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div
                  className={
                    "aspect-square border-2 border-gray-200 rounded-lg overflow-hidden"
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`업로드된 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ImageUpload.displayName = "ImageUpload";
