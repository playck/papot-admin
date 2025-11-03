"use client";

import type { ReactElement } from "react";
import { Category } from "../types/category";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

interface CategoryRowProps {
  category: Category;
  depth?: number;
  expandedIds: Set<number>;
  isDeleting?: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onAddSubCategory: (parentId: number) => void;
  onToggleExpand: (id: number) => void;
}

export default function CategoryRow({
  category,
  depth = 0,
  expandedIds,
  isDeleting,
  onEdit,
  onDelete,
  onAddSubCategory,
  onToggleExpand,
}: CategoryRowProps): ReactElement {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{category.id}</TableCell>
        <TableCell>
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${depth * 24}px` }}
          >
            {hasChildren ? (
              <button
                onClick={() => onToggleExpand(category.id)}
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
        category.children!.map((child) => (
          <CategoryRow
            key={child.id}
            category={child}
            depth={depth + 1}
            expandedIds={expandedIds}
            isDeleting={isDeleting}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSubCategory={onAddSubCategory}
            onToggleExpand={onToggleExpand}
          />
        ))}
    </>
  );
}
