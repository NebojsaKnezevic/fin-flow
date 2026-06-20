import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth.controllers";
import { asyncHandler } from "../middlewares/async.middleware";

const router = Router();

router.post("/register", asyncHandler(registerController));

router.post("/login", asyncHandler(loginController));

router.get("/test", (req, res) => {
  res.status(200).json({ msg: "TEST auth route is working!" });
});

export default router;
