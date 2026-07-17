import { ExpenseCategory } from "@api/schema";

function getDescendantsIds(
  id: number,
  categories: ExpenseCategory[],
): number[] {
  const children = categories.filter((c) => c.parentId === id);

  let result: number[] = [];

  for (const child of children) {
    result.push(child.id);
    result.push(...getDescendantsIds(child.id, categories));
  }

  return [id, ...result];
}

function getParentsIds(id: number, categories: ExpenseCategory[]): number[] {
  const item = categories.find((c) => c.id === id);
  if (item?.parentId === null) return [];
  return [item?.parentId, ...getParentsIds(item?.parentId, categories)];
}

const CategoryHelpers = {
  getDescendantsIds,
  getParentsIds,
};

export default CategoryHelpers;
