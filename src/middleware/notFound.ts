import { type Request, type Response } from "express";
import { MESSAGES } from "../constants/messages.js";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: MESSAGES.COMMON.ROUTE_NOT_FOUND,
    errors: null,
  });
};
