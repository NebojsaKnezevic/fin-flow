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

export * from "./types";
export * from "./zod-to-json";

// ==========================================
// 1. DRIZZLE TABLES & ENUMS
// ==========================================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  country: text("country"),
  birthday: timestamp("birthday"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenseCategory = pgTable("expense_category", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  parentId: integer("parent_id").references(
    (): AnyPgColumn => expenseCategory.id,
    { onDelete: "cascade" },
  ),
  description: text().default(""),
  icon: text("icon").default("folder"),
  color: text("color").default("#FFFFFF"),
});

export const expenseSourceEnum = pgEnum("expense_source", [
  "basic",
  "ai",
  // "camera",
  // "voice",
]);

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

export const expenseItems = pgTable("expense_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  price: numeric("price").notNull(),
  quantity: numeric("quantity").notNull(),
  expenseId: uuid("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
});

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
