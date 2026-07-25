import {
  pgTable,
  text,
  uuid,
  timestamp,
  doublePrecision,
  pgEnum,
  serial,
  integer,
  AnyPgColumn,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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
});
export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;

// ==========================================
// 3. EXPENSES TABELA
// ==========================================
export const expenseSourceEnum = pgEnum("expense_source", [
  "basic",
  "camera",
  "voice",
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

export const expenseItems = pgTable("expense_items", (t) => ({
  id: t.uuid("id").defaultRandom().primaryKey(),
  //IZBACICU NAME!!!!!!!!!
  // name: t.text().notNull(),
  price: t.numeric("price").notNull(),
  quantity: t.numeric("quantity").notNull(),
  // categoryId: t
  //   .integer("category_id")
  //   .notNull()
  //   .references(() => expenseCategory.id, { onDelete: "restrict" }),
  expenseId: t
    .uuid("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
}));

export const insertExpenseItemSchema = createInsertSchema(expenseItems).omit({
  id: true,
  expenseId: true,
});

export type InsertExpenseItem = z.infer<typeof insertExpenseItemSchema>;
export const insertExpenseItemExtendedSchema = insertExpenseItemSchema.extend({
  categories: z
    .array(z.number())
    .min(1, "Expense item must have at least 1 category"),
});

export const insertExpenseExtendedSchema = baseExpenseSchema.extend({
  expenseItemList: z
    .array(insertExpenseItemExtendedSchema)
    .min(1, "Expense must have at least 1 item"),
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
  (t) => ({
    itemId: t
      .uuid("item_id")
      .notNull()
      .references(() => expenseItems.id, { onDelete: "cascade" }),

    categoryId: t
      .integer("category_id")
      .notNull()
      .references(() => expenseCategory.id, { onDelete: "cascade" }),
  }),

  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.categoryId] }),
  }),
);
