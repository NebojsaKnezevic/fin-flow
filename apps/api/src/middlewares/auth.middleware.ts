import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app.error";
import dotenv from "dotenv";
import { UserWithId } from "../db/schemas/schema";
// import { UserWithId } from "../db/schemas/users";

declare global {
  namespace Express {
    interface Request {
      user: UserWithId;
    }
  }
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, "Authorization header missing.");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError(
      401,
      "Invalid authorization format. Expected 'Bearer <token>'.",
    );
  }

  dotenv.config();
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AppError(500, "Server is missing jwt secret.");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as UserWithId;
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError(401, "Expired or invalid token");
  }
}
