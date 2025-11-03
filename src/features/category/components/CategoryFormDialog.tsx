"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Category } from "../types/category";

interface CategoryFormDialogProps {
  category?: Category | null;
  categories?: Category[];
  parentId?: number | null;
  onSubmit: (data: { name: string; parentId?: number | null }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function CategoryFormDialog({
  category,
  categories = [],
  parentId: initialParentId,
  onSubmit,
  onCancel,
  isPending,
}: CategoryFormDialogProps) {
  const [name, setName] = useState(category?.name || "");
  const [parentId, setParentId] = useState<number | null>(
    initialParentId !== undefined ? initialParentId : category?.parentId || null
  );
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(category?.name || "");
    setParentId(
      initialParentId !== undefined
        ? initialParentId
        : category?.parentId || null
    );
    setError("");
    inputRef.current?.focus();
  }, [category, initialParentId]);

  const flattenCategories = (cats: Category[]): Category[] => {
    return cats.flatMap((cat) => [
      cat,
      ...(cat.children ? flattenCategories(cat.children) : []),
    ]);
  };

  const findCategory = (cats: Category[], id: number): Category | null => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategory(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getDisabledCategoryIds = (): Set<number> => {
    const disabledIds = new Set<number>();

    if (category) {
      const collectChildIds = (cat: Category) => {
        disabledIds.add(cat.id);
        cat.children?.forEach(collectChildIds);
      };

      const currentCat = findCategory(categories, category.id);
      if (currentCat) {
        collectChildIds(currentCat);
      }
    }

    return disabledIds;
  };

  const allCategories = flattenCategories(categories);
  const disabledCategoryIds = getDisabledCategoryIds();

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

    onSubmit({ name: trimmedName, parentId });

    if (!category) {
      setName("");
      setParentId(initialParentId !== undefined ? initialParentId : null);
      setError("");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError("");
  };

  const title = category ? "카테고리 수정" : "카테고리 추가";
  const isSubCategory =
    initialParentId !== undefined && initialParentId !== null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {title}
          {isSubCategory && " (하위 카테고리)"}
        </h2>

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

          {(category || isSubCategory) && (
            <div>
              <label className="text-sm font-medium leading-none mb-2 block">
                상위 카테고리
              </label>
              <select
                value={parentId || ""}
                onChange={(e) =>
                  setParentId(e.target.value ? Number(e.target.value) : null)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                disabled={isPending}
              >
                <option value="">최상위 카테고리</option>
                {allCategories.map((cat) => {
                  const isDisabled = disabledCategoryIds.has(cat.id);
                  const isCurrent = category?.id === cat.id;

                  return (
                    <option key={cat.id} value={cat.id} disabled={isDisabled}>
                      {cat.name}
                      {isCurrent && " (현재 카테고리)"}
                      {isDisabled && !isCurrent && " (하위 카테고리)"}
                    </option>
                  );
                })}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {category
                  ? "자기 자신과 하위 카테고리는 상위 카테고리로 선택할 수 없습니다"
                  : "하위 카테고리로 추가됩니다. 다른 상위 카테고리를 선택할 수 있습니다"}
              </p>
            </div>
          )}

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
