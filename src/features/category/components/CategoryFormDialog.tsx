"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Category } from "../types/category";

interface CategoryFormDialogProps {
  category?: Category | null;
  onSubmit: (data: { name: string }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function CategoryFormDialog({
  category,
  onSubmit,
  onCancel,
  isPending,
}: CategoryFormDialogProps) {
  const [name, setName] = useState(category?.name || "");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(category?.name || "");
    setError("");
    inputRef.current?.focus();
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("카테고리명을 입력해주세요");
      return;
    }

    if (trimmedName.length > 15) {
      setError("카테고리명은 15자 이하로 입력해주세요");
      return;
    }

    onSubmit({ name: trimmedName });

    if (!category) {
      setName("");
      setError("");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError("");
  };

  const title = category ? "카테고리 수정" : "카테고리 추가";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium leading-none mb-2 block">
              카테고리명 *
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="카테고리명을 입력하세요"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              disabled={isPending}
            />
            {error && (
              <p className="text-sm font-medium text-destructive mt-2">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "저장 중..." : category ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
