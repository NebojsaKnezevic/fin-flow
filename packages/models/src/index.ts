import {
  pgTable,
  text,
  uuid,
  timestamp,
  doublePrecision,
  pgEnum,
  serial,
  integer,
  numeric,
  AnyPgColumn,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./types";
export * from "./zod-to-json";

// ==========================================
// 1. USERS TABELA
// ==========================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  country: text("country"),
  birthday: timestamp("birthday"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export const userWithIdSchema = selectUserSchema.omit({
  password: true,
  createdAt: true,
});

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type UserWithId = z.infer<typeof userWithIdSchema>;

// ==========================================
// 2. EXPENSE CATEGORY TABELA
// ==========================================
export const expenseCategory = pgTable("expense_category", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  parentId: integer("parent_id").references(
    (): AnyPgColumn => expenseCategory.id,
    { onDelete: "cascade" },
  ),
});

export const expenseCategorySchema = createSelectSchema(expenseCategory);
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;
export const insertExpenseCategorySchema = createInsertSchema(
  expenseCategory,
).omit({
  id: true,
  userId: true,
});
export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;

// ==========================================
// 3. EXPENSES TABELA
// ==========================================
export const expenseSourceEnum = pgEnum("expense_source", [
  "basic",
  "ai",
  // "camera",
  // "voice",
]);

export const expenseSourceSchema = z.enum(expenseSourceEnum.enumValues);
export type ExpenseSource = z.infer<typeof expenseSourceSchema>;

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").default(""),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  totalAmount: doublePrecision("total_amount").default(0),
  currency: text("currency").notNull().default("USD"),
  merchant: text("merchant"),

  note: text("note"),
  source: expenseSourceEnum("source").notNull(),

  occuredAt: timestamp("occured_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const baseExpenseSchema = createInsertSchema(expenses, {
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

export type InsertExpense = z.infer<typeof baseExpenseSchema>;

// ==========================================
// 4. EXPENSE ITEMS TABELA
// ==========================================

export const expenseItems = pgTable("expense_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  //IZBACICU NAME!!!!!!!!!
  // name: t.text().notNull(),
  price: numeric("price").notNull(),
  quantity: numeric("quantity").notNull(),
  // categoryId: t
  //   .integer("category_id")
  //   .notNull()
  //   .references(() => expenseCategory.id, { onDelete: "restrict" }),
  expenseId: uuid("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
});

export const insertExpenseItemSchema = createInsertSchema(expenseItems).omit({
  id: true,
  expenseId: true,
});

export type InsertExpenseItem = z.infer<typeof insertExpenseItemSchema>;
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

export type InsertExpenseItemExtended = z.infer<
  typeof insertExpenseItemExtendedSchema
>;
export type InsertExpenseExtended = z.infer<typeof insertExpenseExtendedSchema>;
// ==========================================
// 5. EXPENSE ITEMS - CATEGORIES TABELA
// ==========================================

export const expenseItemsCategories = pgTable(
  "expense_items_categories",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => expenseItems.id, { onDelete: "cascade" }),

    categoryId: integer("category_id")
      .notNull()
      .references(() => expenseCategory.id, { onDelete: "cascade" }),
  },

  (table) => ({
    pk: primaryKey({ columns: [table.itemId, table.categoryId] }),
  }),
);

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

  console.log(validation.data);

  return validation.data;
}
