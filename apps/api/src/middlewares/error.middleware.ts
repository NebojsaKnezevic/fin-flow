import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { DatabaseError } from "pg";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const dbError =
    err.cause instanceof DatabaseError
      ? err.cause
      : err instanceof DatabaseError
        ? err
        : null;

  if (err instanceof AppError) {
    if (err.toLog) {
      //LOGGING - not implemented yet.
      console.error(`Error ${err.statusCode}: ${err.message}`);
    }

    res.status(err.statusCode).json({
      error: err.message,
    });
  } else if (dbError) {
    // console.error("Database error:", err);
    //LOGGING - not implemented yet.
    res.status(500).json({
      error: "Database Error: " + err.message,
    });
  } else {
    //LOGGING - not implemented yet.
    console.error("Unexpected error:", err);
    res.status(500).json({
      error:
        "Internal Server Error: " + err.cause?.toString() ||
        "An unexpected error occurred.",
    });
  }
}
