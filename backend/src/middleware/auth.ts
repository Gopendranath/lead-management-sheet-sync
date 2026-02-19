import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../lib/appError.js";

export interface AuthRequest extends Request {
  adminId?: string;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    req.adminId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError("Invalid or expired token"));
    }
  }
}
