import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();

// @route POST /api/auth/signup
router.post("/signup", AuthController.signup);
// @route POST /api/auth/login
router.post("/login", AuthController.login);

export const AuthRoutes = router;
