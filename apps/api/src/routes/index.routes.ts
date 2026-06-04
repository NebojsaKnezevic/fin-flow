import { Express, Request, Response } from "express";
import authRoutes from "./auth.routes";

export default function setRoutes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message: "success",
    });
  });

  app.use("/auth", authRoutes);
}
