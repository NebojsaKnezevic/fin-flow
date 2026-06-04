import { Request, Response } from "express";
import { registerSchema } from "../schemas/auth.schema";
import bcrypt from "bcrypt";
import db from "../db/db";
import { eq } from "drizzle-orm";
import { users } from "../db/schemas/users";
import { AppError } from "../errors/app.error";

export async function registerController(req: Request, res: Response) {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    const errs = validation.error.errors;
    throw new AppError(400, errs.map((e) => e.message).join(", "));
  }

  const { email, password } = validation.data;

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new AppError(409, "Email already in use.");
  }

  const hashedPwd = bcrypt.hashSync(password, 10);

  const newUser = await db
    .insert(users)
    .values({ email, password: hashedPwd })
    .returning({ id: users.id })
    .execute();

  res.status(201).json({ id: newUser[0].id, email });
}
