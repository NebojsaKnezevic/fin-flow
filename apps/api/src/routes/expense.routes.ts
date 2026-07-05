import { Router } from "express";
import {
  categoryController,
  expenseController,
} from "../controllers/expense.controllers";

const router = Router();

router.get("/", expenseController);
router.get("/categories", categoryController);

export default router;
