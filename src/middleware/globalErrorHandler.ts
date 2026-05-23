import { type Request, type Response, type NextFunction } from "express";
import type { AppError } from "../utils/AppError";
import { MESSAGES } from "../constants/messages.js";


export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || MESSAGES.COMMON.SOMETHING_WENT_WRONG,
    errors: err.errors || null,
  });
};
