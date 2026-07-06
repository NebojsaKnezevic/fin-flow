import { Request, Response } from "express";
import { AppError } from "../errors/app.error";
import { expenseCategory, expenses } from "../db/schemas/schema";
import db from "../db/db";
import { aliasedTable, count, desc, eq, isNull, or, sql } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
import { formatCategoriesToTree } from "../../helpers/category.helper";

export async function expenseController(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (page < 1 || limit < 1)
    throw new AppError(400, "Page and limit must be positive numbers.");

  const offset = (page - 1) * limit;
  const userFilter = eq(expenses.userId, req.user.id);

  const [data, totalCountResult] = await Promise.all([
    db
      .select()
      .from(expenses)
      .where(userFilter)
      .orderBy(desc(expenses.occuredAt))
      .limit(limit)
      .offset(offset),

    db.select({ total: count() }).from(expenses).where(userFilter),
  ]);

  const totalItems = totalCountResult[0]?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json({
    data,
    meta: {
      currentPage: page,
      limit,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
    },
  });
}

export async function categoryController(req: Request, res: Response) {
  const userId = req.user?.id || (req.query.userId as string);
  console.log(userId);
  // const parentCategory = aliasedTable(expenseCategory, "parent_category");
  // const childCategory = aliasedTable(expenseCategory, "child_category");

  const result = await db
    .select()
    .from(expenseCategory)
    .where(
      or(eq(expenseCategory.userId, userId), isNull(expenseCategory.parentId)),
    );

  return res.status(200).json(result);
}
