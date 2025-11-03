import { Category } from "../types/category";

/**
 * 카테고리 목록을 트리 구조로 변환
 */
export default function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<number, Category>();
  const rootCategories: Category[] = [];

  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  categories.forEach((category) => {
    const categoryNode = categoryMap.get(category.id)!;
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children!.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    } else {
      rootCategories.push(categoryNode);
    }
  });

  return rootCategories;
}
