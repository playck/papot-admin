"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/providers/toast-provider";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../services/hooks";
import { Category } from "../types/category";
import CategoryTable from "./CategoryTable";
import CategoryFormDialog from "./CategoryFormDialog";
import { Plus } from "lucide-react";

export default function CategoryListView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { data, isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { showSuccess, showError } = useToast();

  const isPending = isCreating || isUpdating;

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    deleteCategory(id, {
      onSuccess: () => {
        showSuccess("삭제 완료", "카테고리가 삭제되었습니다.");
      },
      onError: (error) => {
        showError("삭제 실패", error.message);
      },
    });
  };

  const handleSubmit = (formData: { name: string }) => {
    if (selectedCategory) {
      // 수정
      updateCategory(
        {
          id: selectedCategory.id,
          name: formData.name,
        },
        {
          onSuccess: () => {
            showSuccess("수정 완료", "카테고리가 수정되었습니다.");
            setIsDialogOpen(false);
            setSelectedCategory(null);
          },
          onError: (error) => {
            showError("수정 실패", error.message);
          },
        }
      );
    } else {
      // 생성
      createCategory(
        {
          name: formData.name,
        },
        {
          onSuccess: () => {
            showSuccess("추가 완료", "카테고리가 추가되었습니다.");
            setIsDialogOpen(false);
          },
          onError: (error) => {
            showError("추가 실패", error.message);
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            전체 {data?.total || 0}개의 카테고리
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          카테고리 추가
        </Button>
      </div>

      <CategoryTable
        categories={data?.categories || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {isDialogOpen && (
        <CategoryFormDialog
          category={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={isPending}
        />
      )}
    </div>
  );
}
