"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { Category } from "../types/category";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "카테고리명을 입력해주세요")
    .max(15, "카테고리명은 15자 이하로 입력해주세요"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  category?: Category | null;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function CategoryFormDialog({
  category,
  onSubmit,
  onCancel,
  isPending,
}: CategoryFormDialogProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [category, form]);

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    if (!category) {
      form.reset();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {category ? "카테고리 수정" : "카테고리 추가"}
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리명 *</FormLabel>
                  <FormControl>
                    <FormInput
                      placeholder="카테고리명을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </div>
    </div>
  );
}
