import { Request, Response } from "express";
import { AppError } from "../errors/app.error";
import {
  expenseCategory,
  expenseItems,
  expenseItemsCategories,
  expenses,
  InsertExpense,
  InsertExpenseExtended,
  insertExpenseExtendedSchema,
} from "@repo/models";
import db from "../db/db";
import { aliasedTable, count, desc, eq, isNull, or, sql } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
// import { formatCategoriesToTree } from "../../helpers/category.helper";
import { z } from "zod";
// import { aiService } from "../../services/ai.services.ts";
import fs from "fs/promises";
import { aiService } from "../../services/ai.services";

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

  const result = await db
    .select()
    .from(expenseCategory)
    .where(
      or(eq(expenseCategory.userId, userId), isNull(expenseCategory.parentId)),
    );

  return res.status(200).json(result);
}

export async function aiController(req: Request, res: Response) {
  const userId = req.user.id;
  const prompt = req.body.prompt;

  // const expenseImg = await fs.readFile('/home/nebo/Downloads/black-white-vector-illustration-receipt-template_97886-8.webp')
  // const imgBase64 = expenseImg.toString('base64');

  const categories = await db
    .select()
    .from(expenseCategory)
    .where(
      or(eq(expenseCategory.userId, userId), isNull(expenseCategory.parentId)),
    );

  const response = await aiService.analyze(
    prompt +
      " vrati json, dole su ti kateorije usera, " +
      categories.map((c) => c.category).join(","),
    "/home/nebo/Downloads/receipt.webp",
  );

  console.log(response);
  return res.status(200).json(response);
}

export async function createExpenseController(req: Request, res: Response) {
  req.body.userId = req.user.id;
  // console.log(req.body);
  const parsed = insertExpenseExtendedSchema.safeParse(req.body);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    console.log(`Validation failed: ${JSON.stringify(tree, null, 2)}`);
    throw new AppError(400, `Validation failed: ${JSON.stringify(tree)}`);
  }

  // const body = req.body as InsertExpenseExtended;
  const { expenseItemList = [], ...expenseData } = parsed.data;
  expenseData.userId = req.user.id;
  // console.log(expenseItemList);
  // console.log(expenseData);

  const allGood = await db.transaction(async (t) => {
    //====================================
    //step1 expense goes 1st
    //====================================
    const [insertedExpense] = await t
      .insert(expenses)
      .values({ ...expenseData, occuredAt: new Date(expenseData.occuredAt) })
      .returning({ id: expenses.id });
    //====================================
    //step2 expense items 2nd
    //====================================
    const itemsToInsert = expenseItemList.map((item) => ({
      price: item.price,
      quantity: item.quantity,
      expenseId: insertedExpense.id,
    }));

    const insertedItems = await t
      .insert(expenseItems)
      .values(itemsToInsert)
      .returning({ id: expenseItems.id });
    //====================================
    //step3 expense item categories 3rd
    //====================================
    const categoriesToInsert: { itemId: string; categoryId: number }[] = [];

    insertedItems.forEach((insertedItem, index) => {
      const originalItem = expenseItemList[index];

      if (originalItem.categories && originalItem.categories.length > 0) {
        originalItem.categories.forEach((catId) => {
          categoriesToInsert.push({
            itemId: insertedItem.id,
            categoryId: catId,
          });
        });
      }
    });

    if (categoriesToInsert.length > 0) {
      await t.insert(expenseItemsCategories).values(categoriesToInsert);
    }

    return {
      expenseId: insertedExpense.id,
      insertedItemsCount: insertedItems.length,
      attachedCategoriesCount: categoriesToInsert.length,
    };
  });

  return res.status(201).json(allGood);
}
