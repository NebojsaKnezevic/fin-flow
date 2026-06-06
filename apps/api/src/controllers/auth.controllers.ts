import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import bcrypt from "bcrypt";
import db from "../db/db";
import { eq } from "drizzle-orm";
import { users, UserWithId } from "../db/schemas/users";
import { AppError } from "../errors/app.error";
import jwt from "jsonwebtoken";

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

export async function loginController(req: Request, res: Response) {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    const err = validation.error.errors;
    throw new AppError(400, err[0].message);
  }

  const { email, password } = validation.data;

  if (email === "" || password === "") {
    throw new AppError(400, "Missing email or password.");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((res) => res[0]);

  const isValidPwd = bcrypt.compareSync(password, user.password);

  if (!isValidPwd) {
    throw new AppError(401, "Invalid email or password.");
  }

  const JWT_SECRET = process.env.JWT_SECRET || "asdasdasdadas@@@@";
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    message: "success",
    token,
    user: { id: user.id, email: user.email },
  });
}
