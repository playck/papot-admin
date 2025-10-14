"use client";

import { useState } from "react";
import { supabase } from "@/services/supabase/client";
import { useAuth } from "./useAuth";

interface UploadOptions {
  // 스토리지 버킷 이름
  bucket?: string;
  pathPrefix?: string;
  includeUserId?: boolean;
  addTimestamp?: boolean;
  maxFileSize?: number;
}

// 반환 타입 개선
interface UploadResult {
  successList: string[];
  failedList: Array<{
    file: File;
    error: string;
  }>;
  totalCount: number;
  successCount: number;
  failedCount: number;
}

interface UseImageUploadReturn {
  uploadSingle: (file: File, options?: UploadOptions) => Promise<string>;
  uploadMultiple: (
    files: File[],
    options?: UploadOptions
  ) => Promise<UploadResult>;
  deleteFile: (url: string, bucket?: string) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
}

const DEFAULT_OPTIONS: Required<UploadOptions> = {
  bucket: "product-images",
  pathPrefix: "",
  includeUserId: false,
  addTimestamp: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

export const useImageUpload = (): UseImageUploadReturn => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const generateFileName = (
    file: File,
    options: Required<UploadOptions>
  ): string => {
    const { pathPrefix, includeUserId, addTimestamp } = options;

    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/\s+/g, "_");

    let fileName = cleanFileName;

    if (addTimestamp) {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split(".").pop();
      const nameWithoutExt = cleanFileName.replace(/\.[^/.]+$/, "");
      fileName = `${timestamp}-${randomId}-${nameWithoutExt}.${extension}`;
    }

    const pathParts: string[] = [];

    if (pathPrefix) {
      pathParts.push(pathPrefix);
    }

    if (includeUserId && user?.id) {
      pathParts.push(user.id);
    }

    pathParts.push(fileName);

    return pathParts.join("/");
  };

  const validateFile = (file: File, maxFileSize: number): void => {
    if (!file.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드할 수 있습니다.");
    }

    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      throw new Error(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
    }
  };

  const extractFilePathFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");

      // product-images 버킷을 찾기
      const bucketIndex = pathSegments.findIndex(
        (segment) => segment === "product-images"
      );

      if (bucketIndex === -1) {
        throw new Error("올바르지 않은 스토리지 URL입니다.");
      }

      // product-images 다음부터가 실제 파일 경로
      const filePath = pathSegments.slice(bucketIndex + 1).join("/");
      return filePath;
    } catch (error) {
      console.error("URL 경로 추출 오류:", error);
      throw new Error("URL에서 파일 경로를 추출할 수 없습니다.");
    }
  };

  const uploadSingle = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<string> => {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    if (!user?.id) {
      throw new Error("로그인이 필요합니다.");
    }

    validateFile(file, mergedOptions.maxFileSize);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileName = generateFileName(file, mergedOptions);

      const { error } = await supabase.storage
        .from(mergedOptions.bucket)
        .upload(fileName, file, {
          metadata: {
            userId: user.id,
            uploadedAt: new Date().toISOString(),
          },
        });

      if (error) {
        throw new Error(`이미지 업로드 실패: ${error.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(mergedOptions.bucket).getPublicUrl(fileName);

      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  type MultipleUploadResult =
    | { status: "fulfilled"; value: string; file: File }
    | { status: "rejected"; reason: string; file: File };

  const processMultipleUploadResults = (
    results: PromiseSettledResult<MultipleUploadResult>[]
  ): {
    successList: string[];
    failedList: Array<{ file: File; error: string }>;
  } => {
    const successList: string[] = [];
    const failedList: Array<{ file: File; error: string }> = [];

    results.forEach((result) => {
      if (result.status !== "fulfilled") {
        console.warn("Promise 실행 실패:", result.reason);
        return;
      }

      const uploadResult = result.value;

      if (uploadResult.status === "fulfilled") {
        successList.push(uploadResult.value);
      } else if (uploadResult.status === "rejected") {
        failedList.push({
          file: uploadResult.file,
          error: uploadResult.reason,
        });
      }
    });

    return { successList, failedList };
  };

  const uploadMultiple = async (
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    if (files.length === 0) {
      return {
        successList: [],
        failedList: [],
        totalCount: 0,
        successCount: 0,
        failedCount: 0,
      };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const currentProgress = Math.round(((index + 1) / files.length) * 100);

        try {
          const url = await uploadSingle(file, options);
          setUploadProgress(currentProgress);
          return { status: "fulfilled" as const, value: url, file };
        } catch (error) {
          return {
            status: "rejected" as const,
            reason: error instanceof Error ? error.message : "알 수 없는 오류",
            file,
          };
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const { successList, failedList } = processMultipleUploadResults(results);

      return {
        successList,
        failedList,
        totalCount: files.length,
        successCount: successList.length,
        failedCount: failedList.length,
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (
    url: string,
    bucket = "product-images"
  ): Promise<void> => {
    try {
      const filePath = extractFilePathFromUrl(url);
      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) {
        throw new Error(`파일 삭제 실패: ${error.message}`);
      }
    } catch (error) {
      console.error("파일 삭제 오류:", error);
      throw error;
    }
  };

  return {
    uploadSingle,
    uploadMultiple,
    deleteFile,
    isUploading,
    uploadProgress,
  };
};
