import { expenseCategory } from "@repo/models";
import db from "../db/db";
import { eq, isNull, or } from "drizzle-orm";

export const categoryRepository = {
  async findAllForUser(userId: string) {
    return await db
      .select()
      .from(expenseCategory)
      .where(
        or(
          eq(expenseCategory.userId, userId),
          isNull(expenseCategory.parentId),
        ),
      );
  },
};
