import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { loginSchema } from "../validators/auth.validator.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export default router;
