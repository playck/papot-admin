"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

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

interface FileUploadProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  onChange,
  placeholder = "이미지를 선택하거나 드래그 해 주세요.",
  accept = "image/*",
  className,
  disabled = false,
  maxFiles = 5,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList) => {
    const validFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, maxFiles - value.length);

    const newImages = await Promise.all(
      validFiles.map((file) => readFileAsDataURL(file))
    );

    onChange?.([...value, ...newImages]);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
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
    const newImages = value.filter((_, i) => i !== index);
    onChange?.(newImages);
  };

  const handleClick = () => {
    if (value.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  const isMaxReached = value.length >= maxFiles;

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
        className={getUploadAreaStyles(isDragOver, isMaxReached, disabled)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled && !isMaxReached ? handleClick : undefined}
      >
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Upload className="w-8 h-8 mb-2" />
          <p className="text-sm text-center px-2">
            {isMaxReached
              ? `최대 ${maxFiles}개 이미지까지 업로드 가능합니다`
              : placeholder}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG (최대 {MAX_FILE_SIZE_MB}MB) • {value.length}/{maxFiles}
          </p>
        </div>
      </div>

      {/* 이미지 리스트 */}
      {value.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            업로드된 이미지 ({value.length})
          </h4>
          <div className={`grid ${GRID_RESPONSIVE_CLASSES} gap-4`}>
            {value.map((image, index) => (
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

FileUpload.displayName = "FileUpload";
