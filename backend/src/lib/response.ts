import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200) {
  const body: SuccessResponse<T> = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
}

export function sendError(res: Response, error: string, statusCode = 500, details?: unknown) {
  const body: ErrorResponse = { success: false, error };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
) {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  return res.status(200).json(body);
}
