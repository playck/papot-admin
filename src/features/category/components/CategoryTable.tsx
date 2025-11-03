"use client";

import { useState } from "react";
import { Category } from "../types/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryRow from "./CategoryRow";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onAddSubCategory: (parentId: number) => void;
  isDeleting?: boolean;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onAddSubCategory,
  isDeleting,
}: CategoryTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>카테고리명</TableHead>
            <TableHead className="w-[150px]">생성일</TableHead>
            <TableHead className="w-[280px] text-center">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center">
                등록된 카테고리가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                expandedIds={expandedIds}
                isDeleting={isDeleting}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubCategory={onAddSubCategory}
                onToggleExpand={toggleExpand}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
