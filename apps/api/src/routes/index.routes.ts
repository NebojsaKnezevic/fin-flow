import { Express, Request, Response } from "express";
import authRoutes from "./auth.routes";
import expenseRoutes from "./expense.routes";
import authMiddleware from "../middlewares/auth.middleware";

export default function setRoutes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message: "success",
    });
  });

  app.use(
    "/auth",
    // (req: Request, res: Response, next: Function) => {
    //   res.status(401).json({ message: "Unauthorized" });
    // },

    authRoutes,
  );
  app.use("/expenses", expenseRoutes);
}
