"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { Category } from "../types/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

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

  const renderCategoryRow = (
    category: Category,
    depth: number = 0
  ): ReactElement => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
      <>
        <TableRow key={category.id}>
          <TableCell className="font-medium">{category.id}</TableCell>
          <TableCell>
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="p-0 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              ) : (
                <span className="w-4" />
              )}
              <span className={depth > 0 ? "text-gray-700" : "font-semibold"}>
                {category.name}
              </span>
              {depth > 0 && (
                <span className="text-xs text-gray-400 ml-1">(하위)</span>
              )}
            </div>
          </TableCell>
          <TableCell className="text-gray-500">
            {dayjs(category?.createdAt || "").format("YYYY-MM-DD")}
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-center gap-2">
              {depth === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSubCategory(category.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  하위 추가
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(category.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                삭제
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          category.children!.map((child) =>
            renderCategoryRow(child, depth + 1)
          )}
      </>
    );
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
            categories.map((category) => renderCategoryRow(category))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
