import { Request, Router, Response } from "express";
import {
  categoryController,
  createExpenseController,
  expenseController,
} from "../controllers/expense.controllers";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", expenseController);
router.get("/categories", authMiddleware, categoryController);
router.post("/createExpense", authMiddleware, createExpenseController);

export default router;
