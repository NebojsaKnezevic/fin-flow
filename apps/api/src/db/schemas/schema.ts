import {
  pgTable,
  text,
  uuid,
  timestamp,
  doublePrecision,
  pgEnum,
  serial,
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
// 2. EXPENSE CATEGORY TABELA (Tvoja super ideja)
// ==========================================
export const expenseCategory = pgTable("expense_category", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  // testKolona: text("test_kolona"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
});

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
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  totalAmount: doublePrecision("total_amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  merchant: text("merchant"),

  // categoryId: integer("category_id")
  //   .notNull()
  //   .references(() => expenseCategory.id, { onDelete: "restrict" }),

  note: text("note"),
  source: expenseSourceEnum("source").notNull(),

  occuredAt: timestamp("occured_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  userId: true,
  source: true,
  createdAt: true,
  updatedAt: true,
});

export type Expenses = z.infer<typeof insertExpenseSchema>;

// ==========================================
// 4. EXPENSE ITEMS TABELA
// ==========================================

export const expenseItems = pgTable("expense_items", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  name: t.text().notNull(),
  price: t.doublePrecision().notNull(),
  quantity: t.doublePrecision().notNull(),
  categoryId: t
    .integer("category_id")
    .notNull()
    .references(() => expenseCategory.id, { onDelete: "restrict" }),
  expenseId: t
    .uuid("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
}));
