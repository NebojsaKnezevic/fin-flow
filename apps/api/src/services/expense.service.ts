import {
  insertExpenseExtendedSchema,
  baseExpenseSchema,
  insertExpenseItemExtendedSchema,
  expenseItemListSchema,
} from "@repo/models";
import { categoryRepository } from "../repository/expense.repo";
import { aiService } from "./ai.service";
import { AppError } from "../errors/app.error";

export const categoryService = {
  async getCategoriesForUser(userId: string) {
    const categories = await categoryRepository.findAllForUser(userId);

    return categories;
  },
};

// export const expenseService = {
//   async *processExpenseWithAI(
//     userId: string,
//     inputText?: string,
//     imgPath?: string,
//   ) {
//     if (!inputText && !imgPath) {
//       throw new AppError(400, "Please provide data via text or image.");
//     }

//     const promptExpense =
//       "Extract basic metadata: merchant name, total amount, currency, and date.";

//     const parsedExpense = await aiService.analyzePrompt({
//       model: "gemini-3.1-flash-lite",
//       prompt: promptExpense,
//       schema: baseExpenseSchema,
//       imgPath,
//     });

//     //validate
//     baseExpenseSchema.parse(JSON.parse(parsedExpense.output_text || "{}"));
//     //yield
//     yield { packet: "expense", data: parsedExpense };

//     const categories = await categoryService.getCategoriesForUser(userId);

//     const promptExpenseItems = `You got the list of categories.
//     1. Every expense item must be categoryzed as new category.
//     2. New category should recieve proper parent if it makes sense.
//     ${JSON.stringify(categories.map((x) => ({ ...x, userId: "" }))).replace(" ", "")}`;

//     // console.log("promptExpenseItems ", promptExpenseItems);

//     const parsedExpenseItems = await aiService.analyzePromptStream({
//       model: "gemini-3.1-pro-preview",
//       prompt: promptExpenseItems,
//       schema: expenseItemListSchema,
//       imgPath,
//     });

//     for await (const chunk of parsedExpenseItems) {
//       //   console.log("STREAM CHUNK:", JSON.stringify(chunk, null, 2));
//       //   if (chunk.event_type === "step.delta" && chunk.delta?.type === "text") {
//       yield {
//         packet: "expense-items",
//         data: chunk,
//       };
//       //   }
//     }

//     yield { packet: "expense-items-end", data: null };

//     // const [expense, expenseItems] = await Promise.all([
//     //   parsedExpense,
//     //   parsedExpenseItems,
//     // ]);

//     // return parsedExpense;
//   },
// };
