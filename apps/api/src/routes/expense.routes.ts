import { Router } from "express";
import { expenseController } from "../controllers/expense.controller";

const router = Router();

router.get("/", expenseController);

export default router;
