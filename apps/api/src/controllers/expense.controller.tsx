import { Request, Response } from "express";
import { AppError } from "../errors/app.error";
import { expenses } from "../db/schemas/schema";
import db from "../db/db";
import { count, desc, eq } from "drizzle-orm";

export async function expenseController(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (page < 1 || limit < 1)
    throw new AppError(400, "Page and limit must be positive numbers.");

  const offset = (page - 1) * limit;
  const userFilter = eq(
    expenses.userId,
    req.user?.id || "8bde4059-33ce-4975-9c96-f56a23f6f2ad",
  );

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
