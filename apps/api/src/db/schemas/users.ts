import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
// import { create } from 'node:domain';

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof users>;

export type NewUser = Omit<InferInsertModel<typeof users>, "id" | "createdAt">;
