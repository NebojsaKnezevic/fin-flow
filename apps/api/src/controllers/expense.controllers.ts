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

import { aiService } from "../services/ai.service";
import { getJsonSchema, insertExpenseItemExtendedSchema } from "@repo/models";
import { categoryService, expenseService } from "../services/expense.service";
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

// export async function aiController(req: Request, res: Response) {
//   const userId = req.user.id;
//   const prompt = req.body.prompt;

//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   // const expenseImg = await fs.readFile('/home/nebo/Downloads/black-white-vector-illustration-receipt-template_97886-8.webp')
//   // const imgBase64 = expenseImg.toString('base64');

//   const responseSSE = expenseService.processExpenseWithAI(
//     userId,
//     prompt,
//     "/home/nebo/Downloads/receipt.webp",
//   );

//   for await (const event of responseSSE) {
//     const payload =
//       typeof event.data === "string" ? event.data : JSON.stringify(event.data);
//     // console.log(`event: ${event.packet}\n`);
//     // console.log(`data: ${payload}\n\n`);
//     console.log(event);
//     res.write(`event: ${event.packet}\n`);
//     res.write(`data: ${payload}\n\n`);
//   }

//   // res.write("SSE end");
//   res.end();
//   // console.log(response.output_text);
//   // console.log(response);
//   // return res.status(200).json(response);
// }

export async function aiController(req: Request, res: Response) {
  const userId = req.user.id;
  const prompt = req.body.prompt;

  // const expenseImg = await fs.readFile('/home/nebo/Downloads/black-white-vector-illustration-receipt-template_97886-8.webp')
  // const imgBase64 = expenseImg.toString('base64');

  const start = Date.now();

  const categories = await categoryService.getCategoriesForUser(userId);

  const promptExpense =
    "Extract basic metadata: merchant name, total amount, currency, and date.";

  const promptExpenseItems = `${prompt} ${promptExpense}
      You got the list of categories.
      1. Every expense item must be categoryzed as new category.
      2. New category should recieve proper parent if it makes sense.
      ${JSON.stringify(categories.map((x) => ({ ...x, userId: "" }))).replace(" ", "")}`;

  const response = await aiService.analyzePrompt({
    model: "gemini-3.6-flash",
    prompt: promptExpenseItems,
    schema: insertExpenseExtendedSchema,
    imgPath: "/home/nebo/Downloads/receipt.webp",
  });

  const end = Date.now();
  console.log(`Duration: ${(end - start) / 1000.0}s`);
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
