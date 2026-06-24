import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import bcrypt from "bcrypt";
import db from "../db/db";
import { eq } from "drizzle-orm";
import { users, UserWithId } from "../db/schemas/schema";
import { AppError } from "../errors/app.error";
import jwt from "jsonwebtoken";

export async function registerController(req: Request, res: Response) {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    const errs = validation.error;
    throw new AppError(400, errs.message);
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
    const err = validation.error;
    throw new AppError(400, err.message);
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

  // console.log(user);

  if (!user) {
    throw new AppError(401, "Invalid email or password.");
  }

  const isValidPwd = bcrypt.compareSync(password, user.password);

  if (!isValidPwd) {
    throw new AppError(401, "Invalid email or password.");
  }

  const JWT_SECRET = process.env.JWT_SECRET || "asdasdasdadas@@@@";
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      country: user.country,
      birthday: user.birthday,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.status(200).json({
    message: "success",
    token,
    user: { id: user.id, email: user.email },
  });
}

export async function meController(req: Request, res: Response) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized: Missing token" });

  const token = authHeader.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET || "asdasdasdadas@@@@";

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserWithId & {
      iat: number;
      exp: number;
    };

    const { iat, exp, ...userProfile } = decoded;

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(401).json({ error: "Incorrect json token" });
  }
}
