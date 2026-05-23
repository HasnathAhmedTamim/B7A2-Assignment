import { type Request, type Response, type NextFunction } from "express";
import type { AppError } from "../utils/AppError";
// import { AppError } from "../utils/AppError.js";

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: err.errors || null,
  });
};
