import { Request, Router, Response } from "express";
import {
  aiController,
  categoryController,
  createExpenseController,
  expenseController,
} from "../controllers/expense.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});
const router = Router();

router.get("/", expenseController);
router.get("/categories", authMiddleware, categoryController);
router.post("/createExpense", authMiddleware, createExpenseController);
router.post(
  "/createExpenseAI",
  authMiddleware,
  aiController,
  // async (req: Request, res: Response) => {
  //   const response = await aiService.analyze(req.body.prompt);

  //   console.log(response);

  //   res.status(200).json({
  //     data: JSON.parse(response || "{}"),
  //   });
  // },
);

export default router;
