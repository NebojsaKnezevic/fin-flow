import { Router } from "express";
import {
  loginController,
  meController,
  registerController,
} from "../controllers/auth.controllers";
import { asyncHandler } from "../middlewares/async.middleware";

const router = Router();

router.post("/register", asyncHandler(registerController));

router.post("/login", asyncHandler(loginController));

router.get("/test", (req, res) => {
  res.status(200).json({ msg: "TEST auth route is working!" });
});

router.get("/me", asyncHandler(meController));

export default router;
