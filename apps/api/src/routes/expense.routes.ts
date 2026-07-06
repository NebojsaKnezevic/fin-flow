import { Router } from "express";
import {
  categoryController,
  expenseController,
} from "../controllers/expense.controllers";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/", expenseController);
router.get("/categories", authMiddleware, categoryController);

export default router;
