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
  aiExpenseExtractionSchema,
  AiRequestSchema,
} from "@repo/models";
import db from "../db/db";
import { aliasedTable, count, desc, eq, isNull, or, sql } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
// import { formatCategoriesToTree } from "../../helpers/category.helper";
import { z } from "zod";

import { aiService } from "../services/ai.service";
import { getJsonSchema, insertExpenseItemExtendedSchema } from "@repo/models";
import { categoryService } from "../services/expense.service";
import fs from "fs/promises";

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

  const result = await categoryService.getCategoriesForUser(userId);

  return res.status(200).json(result);
}

export async function aiController(req: Request, res: Response) {
  const userId = req.user.id;
  const { prompt, image, isMultiple } = AiRequestSchema.parse(req.body);

  // console.log("Image received! Base64 character length:", image.length);

  const rawHeader = req.headers["x-image-mime-type"];
  const mimeType = Array.isArray(rawHeader)
    ? rawHeader[0]
    : rawHeader || "image/jpeg";

  // const start = Date.now();

  const categories = await categoryService.getCategoriesForUser(userId);

  const multipleExpenses = isMultiple
    ? "RETURN MULTIPLE EXPENSES IF IT MAKES SENSE"
    : "RETURN ONE BIG SINGLE EXPENSE";

  const promptExpenseItems = `You can get all sorts of sources, pure receipts from hand written or user inserted data which will be provided below.
  TASKs: 
  -Try to extract basic info, such as merchant, currency, receipt name, if you can't than make suggestion.
  -Try to extract singular items as per schema. If you cant find it, make a new one and provide him with parent from the list below...
  -Currently newCategory is an actually name of the expense item. I need them all always.
  CATEGORIES:
  ${JSON.stringify(categories.map((x) => ({ ...x, userId: "" }))).replaceAll(" ", "")}
  // MUST RETURN ALL IN ONE BIG EXPENSE: ${!isMultiple}
  USER PROMPT:
  ${prompt}
  `;

  // return res.status(200).json({ msg: promptExpenseItems });
  const response = await aiService.analyzePrompt({
    model: "gemini-3.5-flash",
    prompt: promptExpenseItems,
    schema: aiExpenseExtractionSchema,
    img: image,
    imgMime: mimeType,
  });

  // const end = Date.now();
  // console.log(`Duration: ${(end - start) / 1000.0}s`);
  // console.log(response.usage);

  return res.status(200).json(JSON.parse(response.output_text || "{}"));
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
