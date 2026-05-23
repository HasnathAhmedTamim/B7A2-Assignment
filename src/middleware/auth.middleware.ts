import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { type Request, type Response, type NextFunction } from "express";
import config from "../config/env";
import { AppError } from "../utils/AppError";
import { type AuthUser } from "../types/auth";
import { MESSAGES } from "../constants/messages.js";
export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new AppError(StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;

    req.user = decoded;

    next();
  } catch {
    return next(
      new AppError(StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.INVALID_EXPIRED_TOKEN),
    );
  }
};
