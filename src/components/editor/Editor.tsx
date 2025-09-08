"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import RichTextEditor from "react-simple-wysiwyg";
import { Upload, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import styles from "./Editor.module.css";

export interface EditorRef {
  getValue: () => string;
  setValue: (value: string) => void;
  clear: () => void;
}

export interface EditorProps {
  initialValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  height?: number;
  showPreview?: boolean;
}
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const Editor = forwardRef<EditorRef, EditorProps>(
  (
    {
      initialValue = "",
      placeholder = "내용을 입력 해 주세요.",
      onChange,
      className = "",
      disabled = false,
      showPreview = true,
    },
    ref
  ) => {
    const [editorValue, setEditorValue] = useState(initialValue);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      getValue: () => editorValue,
      setValue: (value: string) => {
        setEditorValue(value);
        onChange?.(value);
      },
      clear: () => {
        setEditorValue("");
        onChange?.("");
      },
    }));

    const handleChange = (e: { target: { value: string } }) => {
      const newValue = e.target.value;
      setEditorValue(newValue);
      onChange?.(newValue);
    };

    // 이미지를 Base64로 변환 (미리보기용)
    const convertToBase64 = async (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    };

    const handleImageBtnClick = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };

    const handleImageUpload = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      setIsUploading(true);
      try {
        // 항상 Base64로 변환 (미리보기용)
        const imageUrl = await convertToBase64(file);
        const imageHtml = `<img src="${imageUrl}" alt="업로드된 이미지" style="max-width: 100%; height: auto;" />`;
        const newValue = editorValue + imageHtml;
        setEditorValue(newValue);
        onChange?.(newValue);
      } catch {
        alert("이미지 업로드에 실패했습니다.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        {/* 커스텀 툴바 */}
        <div className="border-b bg-gray-50 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImageBtnClick}
              disabled={disabled || isUploading}
              className="flex items-center gap-1"
            >
              {isUploading ? (
                <Upload className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              {isUploading ? "업로드 중..." : "이미지"}
            </Button>
          </div>

          {showPreview && (
            <div className="text-sm text-gray-600 font-medium">
              에디터 | 미리보기
            </div>
          )}
        </div>

        {/* 에디터와 미리보기 영역 */}
        <div className={showPreview ? "grid grid-cols-2 gap-1" : ""}>
          {/* 에디터 */}
          <div className="relative">
            <RichTextEditor
              value={editorValue}
              onChange={handleChange}
              placeholder={placeholder}
              style={{
                minHeight: "500px",
              }}
              disabled={disabled}
            />
          </div>

          {/* 미리보기 */}
          {showPreview && (
            <div className="relative">
              <div className="absolute top-2 left-3 text-xs text-gray-500 font-medium">
                미리보기
              </div>
              <div
                className={`p-4 pt-8 ${styles.previewContainer}`}
                style={{ minHeight: "533px" }}
                dangerouslySetInnerHTML={{
                  __html:
                    editorValue ||
                    `<p class="text-gray-400 italic">${placeholder}</p>`,
                }}
              />
            </div>
          )}
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    );
  }
);

Editor.displayName = "Editor";

export default Editor;
