import { Router } from "express";
import {
  loginController,
  meController,
  registerController,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", meController);

router.get("/test", (req, res) => {
  res.status(200).json({ msg: "TEST auth route is working!" });
});

export default router;
