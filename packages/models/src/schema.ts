import * as pg from "./tables";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
// ==========================================
// 2. TYPES & UTILITY FUNCTIONS
// ==========================================

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type UserWithId = z.infer<typeof userWithIdSchema>;

export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;
export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;

export type ExpenseSource = z.infer<typeof expenseSourceSchema>;
export type InsertExpense = z.infer<typeof baseExpenseSchema>;

export type InsertExpenseItem = z.infer<typeof insertExpenseItemSchema>;
export type InsertExpenseItemExtended = z.infer<
  typeof insertExpenseItemExtendedSchema
>;
export type InsertExpenseExtended = z.infer<typeof insertExpenseExtendedSchema>;

export function transformAiResponseToExpense(
  rawAiData: unknown,
  userId: string = "00000000-0000-0000-0000-000000000000",
): InsertExpenseExtended {
  const parsed = aiExpenseExtractionSchema.parse(rawAiData);

  const dateParsed = new Date(parsed.occuredAt);
  const validDate = isNaN(dateParsed.getTime()) ? new Date() : dateParsed;

  const result = {
    name: parsed.name || "Expense",
    userId: userId,
    source: "ai" as const,
    merchant: parsed.merchant ?? null,
    totalAmount: Number(parsed.totalAmount),
    currency: parsed.currency || "RSD",

    occuredAt: validDate,

    expenseItemList: parsed.expenseItemList.map((item) => ({
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      categories: item.categories || [],
      newCategory: item.newCategory
        ? {
            category: item.newCategory.category,
            parentId: item.newCategory.parentId ?? null,
          }
        : null,
    })),
  };

  const validation = insertExpenseExtendedSchema.safeParse(result);

  if (!validation.success) {
    console.error(
      "ZOD VALIDATION FAILED DETAILS:",
      JSON.stringify(validation.error.format(), null, 2),
    );
    throw new Error("Failed to validate expense schema");
  }

  // console.log(validation.data);

  return validation.data;
}

// ==========================================
// 3. ZOD SCHEMAS
// ==========================================

// --- User Schemas ---
export const selectUserSchema = createSelectSchema(pg.users);
export const insertUserSchema = createInsertSchema(pg.users).omit({
  id: true,
  createdAt: true,
});
export const userWithIdSchema = selectUserSchema.omit({
  password: true,
  createdAt: true,
});

// --- Category Schemas ---
export const expenseCategorySchema = createSelectSchema(pg.expenseCategory);
export const insertExpenseCategorySchema = createInsertSchema(
  pg.expenseCategory,
).omit({
  id: true,
  userId: true,
});

// --- Expense Schemas ---
export const expenseSourceSchema = z.enum(pg.expenseSourceEnum.enumValues);

export const baseExpenseSchema = createInsertSchema(pg.expenses, {
  occuredAt: z.coerce.date(),
}).pick({
  name: true,
  userId: true,
  source: true,
  note: true,
  occuredAt: true,
  totalAmount: true,
  currency: true,
  merchant: true,
});

// --- Expense Item Schemas ---
export const insertExpenseItemSchema = createInsertSchema(pg.expenseItems).omit(
  {
    id: true,
    expenseId: true,
  },
);

export const insertExpenseItemExtendedSchema = insertExpenseItemSchema.extend({
  categories: z
    .array(z.number())
    .min(1, "Expense item must have at least 1 category"),
  newCategory: insertExpenseCategorySchema.nullable(),
});

export const expenseItemListSchema = z
  .array(insertExpenseItemExtendedSchema)
  .min(1, "Expense must have at least 1 item");

export const insertExpenseExtendedSchema = baseExpenseSchema.extend({
  expenseItemList: expenseItemListSchema,
});

// --- AI Extraction Schema ---
export const aiExpenseExtractionSchema = baseExpenseSchema
  .omit({
    userId: true,
    source: true,
  })
  .extend({
    name: z
      .string()
      .default("Expense")
      .describe(
        "Short overview name or title of the receipt (e.g. 'Metro Purchase', 'Lidl Groceries').",
      ),
    merchant: z
      .string()
      .nullable()
      .describe(
        "Store or merchant name extracted from the top header of the receipt (e.g., 'Metro Cash & Carry', 'Lidl', 'Maxi'). MUST be populated if visible.",
      ),
    totalAmount: z.number().describe("The total sum paid on the receipt."),
    currency: z
      .string()
      .default("RSD")
      .describe("3-letter currency code, e.g., RSD, EUR, USD."),
    occuredAt: z
      .string()
      .describe(
        "Transaction date in YYYY-MM-DD format (or ISO string) from the receipt.",
      ),
    expenseItemList: z
      .array(
        z.object({
          price: z.number().describe("Price of the single item or line total."),
          quantity: z
            .number()
            .default(1)
            .describe("Quantity of the item purchased."),
          categories: z
            .array(z.number())
            .describe(
              "Array of EXISTING category IDs matching this item. It has to have atleast 1 category id.",
            ),
          newCategory: z
            .object({
              category: z
                .string()
                .describe("Name of the new category to create."),
              parentId: z
                .number()
                .nullable()
                .optional()
                .describe("ID of an existing parent category if applicable."),
            })
            .nullable()
            .describe(
              "If no existing category in 'categories' fits, populate this object with the new category name.",
            ),
        }),
      )
      .min(1, "Receipt must contain at least 1 item"),
  });

//Controllers
export const AiRequestSchema = z.object({
  prompt: z.string().optional().default(""),
  image: z.array(z.string()).optional().default([]),
  isMultiple: z.boolean().default(false),
});

export type AiRequestInput = z.infer<typeof AiRequestSchema>;
