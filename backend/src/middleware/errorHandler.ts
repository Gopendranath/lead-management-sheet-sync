import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/appError.js";
import { Prisma } from "@prisma/client";
import { sendError } from "../lib/response.js";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Custom AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Prisma unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const target = (err.meta?.target as string[])?.join(", ") || "field";
    return sendError(res, `A record with this ${target} already exists.`, 409);
  }

  // Prisma record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return sendError(res, "Record not found.", 404);
  }

  // Fallback
  return sendError(
    res,
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    500,
  );
}
