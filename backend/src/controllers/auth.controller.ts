import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { env } from "../config/env.js";
import { sendSuccess } from "../lib/response.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.cookie("token", result.token, COOKIE_OPTIONS);

      sendSuccess(res, { admin: result.admin }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token", { ...COOKIE_OPTIONS, maxAge: 0 });
      sendSuccess(res, null, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await authService.getAdmin((req as any).adminId);
      sendSuccess(res, { admin });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
